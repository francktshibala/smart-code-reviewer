import express from 'express';
import { prisma } from '../prismaClient';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// POST /api/projects - Create new project
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Validate required fields
    if (!name) {
      return res.status(400).json({ 
        error: 'Project name is required' 
      });
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        userId,
        name,
        description: description || null
      },
      include: {
        _count: {
          select: { analyses: true }
        }
      }
    });

    res.status(201).json({
      message: 'Project created successfully',
      project
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ 
      error: 'Internal server error while creating project' 
    });
  }
});

// GET /api/projects - Get user's projects
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { limit = '20', offset = '0' } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get projects with analysis count
    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        _count: {
          select: { analyses: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    });

    // Get total count for pagination
    const totalCount = await prisma.project.count({
      where: { userId }
    });

    res.json({
      projects,
      pagination: {
        total: totalCount,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: parseInt(offset as string) + parseInt(limit as string) < totalCount
      }
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ 
      error: 'Internal server error while retrieving projects' 
    });
  }
});

// GET /api/projects/:id - Get single project with analyses
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user?.userId;
    const projectId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    // Get project with analyses
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId
      },
      include: {
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 10 // Latest 10 analyses
        },
        _count: {
          select: { analyses: true }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ 
        error: 'Project not found or does not belong to user' 
      });
    }

    res.json({ project });

  } catch (error) {
    console.error('Get single project error:', error);
    res.status(500).json({ 
      error: 'Internal server error while retrieving project' 
    });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user?.userId;
    const projectId = parseInt(req.params.id);
    const { name, description } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    // Verify project belongs to user
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId
      }
    });

    if (!existingProject) {
      return res.status(404).json({ 
        error: 'Project not found or does not belong to user' 
      });
    }

    // Update project
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        description: description || null
      },
      include: {
        _count: {
          select: { analyses: true }
        }
      }
    });

    res.json({
      message: 'Project updated successfully',
      project
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ 
      error: 'Internal server error while updating project' 
    });
  }
});

// DELETE /api/projects/:id - Delete project and all analyses
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user?.userId;
    const projectId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (isNaN(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId
      },
      include: {
        _count: {
          select: { analyses: true }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ 
        error: 'Project not found or does not belong to user' 
      });
    }

    // Delete project (analyses will be deleted due to cascade)
    await prisma.project.delete({
      where: { id: projectId }
    });

    res.json({ 
      message: 'Project deleted successfully',
      deletedAnalyses: project._count.analyses
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ 
      error: 'Internal server error while deleting project' 
    });
  }
});

export default router;