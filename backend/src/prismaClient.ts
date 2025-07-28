import { PrismaClient } from '@prisma/client';

// Performance-optimized Prisma client configuration
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Connection pool health check
let isConnected = false;

// Test Prisma connection
export const testPrismaConnection = async (): Promise<boolean> => {
  try {
    await prisma.$connect();
    isConnected = true;
    console.log('✅ Prisma connected successfully');
    return true;
  } catch (error) {
    isConnected = false;
    console.error('❌ Prisma connection failed:', error);
    return false;
  }
};

// Connection health check
export const isHealthy = (): boolean => isConnected;

// Performance monitoring
export const getPrismaMetrics = async () => {
  try {
    // Basic metrics that work with any database
    const userCount = await prisma.user.count();
    const projectCount = await prisma.project.count();
    const analysisCount = await prisma.analysis.count();
    
    return { 
      users: userCount,
      projects: projectCount,
      analyses: analysisCount
    };
  } catch (error) {
    console.error('Failed to get Prisma metrics:', error);
    return { users: 0, projects: 0, analyses: 0 };
  }
};

// Graceful shutdown with connection cleanup
const gracefulShutdown = async () => {
  console.log('🔄 Closing Prisma connection...');
  await prisma.$disconnect();
  isConnected = false;
  console.log('✅ Prisma connection closed');
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('beforeExit', gracefulShutdown);

export { prisma };
export default prisma;