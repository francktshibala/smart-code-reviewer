import express from 'express';
import { prisma } from '../prismaClient';
import { authenticateToken } from '../middleware/auth';
import { cache, CacheKeys, getOrSet } from '../cache';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// POST /api/analyses - Save analysis result
router.post('/', async (req, res) => {
  try {
    const { projectId, filename, language, analysisData, score } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Validate required fields
    if (!projectId || !filename || !language || !analysisData || score === undefined) {
      return res.status(400).json({ 
        error: 'projectId, filename, language, analysisData, and score are required' 
      });
    }

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: userId
      }
    });

    if (!project) {
      return res.status(404).json({ 
        error: 'Project not found or does not belong to user' 
      });
    }

    // Create analysis
    const analysis = await prisma.analysis.create({
      data: {
        projectId,
        filename,
        language,
        analysisData,
        score: parseInt(score)
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    });

    // Invalidate related cache entries
    cache.delete(CacheKeys.userAnalyses(userId));
    cache.delete(CacheKeys.dashboardData(userId));
    cache.delete(CacheKeys.userStats(userId));
    cache.delete(CacheKeys.languageStats(userId));

    res.status(201).json({
      message: 'Analysis saved successfully',
      analysis
    });

  } catch (error) {
    console.error('Save analysis error:', error);
    res.status(500).json({ 
      error: 'Internal server error while saving analysis' 
    });
  }
});

// GET /api/analyses - Get user's analyses with optional filtering
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { projectId, language, limit = '20', offset = '0' } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Create cache key including filters
    const cacheKey = `${CacheKeys.userAnalyses(userId)}:${projectId || 'all'}:${language || 'all'}:${limit}:${offset}`;

    const result = await getOrSet(cacheKey, async () => {
      // Build where clause
      const whereClause: any = {
        project: {
          userId: userId
        }
      };

      if (projectId) {
        whereClause.projectId = parseInt(projectId as string);
      }

      if (language) {
        whereClause.language = language as string;
      }

      // Get analyses with pagination
      const analyses = await prisma.analysis.findMany({
        where: whereClause,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: parseInt(limit as string),
        skip: parseInt(offset as string)
      });

      // Get total count for pagination
      const totalCount = await prisma.analysis.count({
        where: whereClause
      });

      return {
        analyses,
        pagination: {
          total: totalCount,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          hasMore: parseInt(offset as string) + parseInt(limit as string) < totalCount
        }
      };
    }, 2 * 60 * 1000); // Cache for 2 minutes

    res.json(result);

  } catch (error) {
    console.error('Get analyses error:', error);
    res.status(500).json({ 
      error: 'Internal server error while retrieving analyses' 
    });
  }
});

// GET /api/analyses/stats/dashboard - Get dashboard statistics with caching
router.get('/stats/dashboard', async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const dashboardData = await getOrSet(
      CacheKeys.dashboardData(userId),
      async () => {
        // Get user's analyses count and scores
        const userAnalyses = await prisma.analysis.findMany({
          where: {
            project: {
              userId: userId
            }
          },
          select: {
            id: true,
            score: true,
            language: true,
            createdAt: true,
            project: {
              select: {
                name: true
              }
            }
          }
        });

        // Calculate statistics
        const totalAnalyses = userAnalyses.length;
        const averageScore = totalAnalyses > 0 
          ? Math.round(userAnalyses.reduce((sum, a) => sum + a.score, 0) / totalAnalyses)
          : 0;

        // Recent activity (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentAnalyses = userAnalyses.filter(a => a.createdAt >= sevenDaysAgo);

        // Language breakdown
        const languageBreakdown = userAnalyses.reduce((acc, analysis) => {
          acc[analysis.language] = (acc[analysis.language] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Top project by analysis count
        const projectCounts = userAnalyses.reduce((acc, analysis) => {
          const projectName = analysis.project.name;
          acc[projectName] = (acc[projectName] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const topProjectEntry = Object.entries(projectCounts)
          .sort(([,a], [,b]) => b - a)[0];

        const topProject = topProjectEntry ? {
          name: topProjectEntry[0],
          count: topProjectEntry[1]
        } : null;

        return {
          totalAnalyses,
          averageScore,
          recentActivity: recentAnalyses.length,
          topProject,
          languageBreakdown,
          lastUpdated: new Date().toISOString()
        };
      },
      5 * 60 * 1000 // Cache for 5 minutes
    );

    res.json(dashboardData);

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ 
      error: 'Internal server error while retrieving dashboard statistics' 
    });
  }
});

// GET /api/analyses/:id - Get single analysis
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user?.userId;
    const analysisId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (isNaN(analysisId)) {
      return res.status(400).json({ error: 'Invalid analysis ID' });
    }

    // Get analysis and verify ownership
    const analysis = await prisma.analysis.findFirst({
      where: {
        id: analysisId,
        project: {
          userId: userId
        }
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            userId: true
          }
        }
      }
    });

    if (!analysis) {
      return res.status(404).json({ 
        error: 'Analysis not found or does not belong to user' 
      });
    }

    res.json({ analysis });

  } catch (error) {
    console.error('Get single analysis error:', error);
    res.status(500).json({ 
      error: 'Internal server error while retrieving analysis' 
    });
  }
});

// DELETE /api/analyses/:id - Delete analysis
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user?.userId;
    const analysisId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (isNaN(analysisId)) {
      return res.status(400).json({ error: 'Invalid analysis ID' });
    }

    // Verify analysis belongs to user before deleting
    const analysis = await prisma.analysis.findFirst({
      where: {
        id: analysisId,
        project: {
          userId: userId
        }
      }
    });

    if (!analysis) {
      return res.status(404).json({ 
        error: 'Analysis not found or does not belong to user' 
      });
    }

    // Delete analysis
    await prisma.analysis.delete({
      where: { id: analysisId }
    });

    // Invalidate related cache entries
    cache.delete(CacheKeys.userAnalyses(userId));
    cache.delete(CacheKeys.dashboardData(userId));
    cache.delete(CacheKeys.userStats(userId));
    cache.delete(CacheKeys.languageStats(userId));

    res.json({ message: 'Analysis deleted successfully' });

  } catch (error) {
    console.error('Delete analysis error:', error);
    res.status(500).json({ 
      error: 'Internal server error while deleting analysis' 
    });
  }
});

export default router;