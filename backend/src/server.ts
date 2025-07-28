import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Database functions now handled by Prisma only
import { testPrismaConnection, getPrismaMetrics, isHealthy } from './prismaClient';
import { cache } from './cache';
import authRoutes from './routes/auth';
import analysesRoutes from './routes/analyses';
import projectsRoutes from './routes/projects';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/analyses', analysesRoutes);

// Health check route with database status
app.get('/api/health', async (req, res) => {
  try {
    const prismaConnected = isHealthy();
    
    res.json({ 
      status: 'OK', 
      message: 'Smart Code Reviewer Backend is running',
      database: prismaConnected ? 'Connected' : 'Disconnected',
      schema: prismaConnected ? 'Ready' : 'Not initialized',
      prisma: prismaConnected ? 'Ready' : 'Not connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Performance monitoring endpoint
app.get('/api/metrics', async (req, res) => {
  try {
    const cacheStats = cache.getStats();
    const prismaMetrics = await getPrismaMetrics();
    const memoryUsage = process.memoryUsage();
    
    res.json({
      status: 'OK',
      cache: cacheStats,
      database: {
        connected: isHealthy(),
        metrics: prismaMetrics,
      },
      system: {
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
        },
        uptime: `${Math.round(process.uptime())}s`,
        nodeVersion: process.version,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to retrieve metrics',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  
  // Test database connection on startup
  console.log('🔍 Testing database connection...');
  await testPrismaConnection();
});

export default app;