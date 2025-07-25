import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './database';
import { checkTablesExist } from './initDatabase';
import { testPrismaConnection } from './prismaClient';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route with database status
app.get('/api/health', async (req, res) => {
  const dbConnected = await testConnection();
  const tablesExist = dbConnected ? await checkTablesExist() : false;
  const prismaConnected = await testPrismaConnection();
  
  res.json({ 
    status: 'OK', 
    message: 'Smart Code Reviewer Backend is running',
    database: dbConnected ? 'Connected' : 'Disconnected',
    schema: tablesExist ? 'Ready' : 'Not initialized',
    prisma: prismaConnected ? 'Ready' : 'Not connected',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

export default app;