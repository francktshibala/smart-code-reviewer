import { PrismaClient } from '@prisma/client';

// Initialize Prisma client with connection pooling
const prisma = new PrismaClient({
  log: ['error'],
});

// Test Prisma connection
export const testPrismaConnection = async (): Promise<boolean> => {
  try {
    await prisma.$connect();
    console.log('✅ Prisma connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Prisma connection failed:', error);
    return false;
  }
};

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export { prisma };
export default prisma;