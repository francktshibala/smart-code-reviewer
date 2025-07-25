#!/usr/bin/env ts-node

// Database setup script - run once to initialize schema
import { initializeDatabase, checkTablesExist } from './initDatabase';
import { testConnection } from './database';

async function setup() {
  console.log('🚀 Starting database setup...');
  
  // Test connection first
  const connected = await testConnection();
  if (!connected) {
    console.error('❌ Cannot connect to database. Check your connection string.');
    process.exit(1);
  }
  
  // Check if tables already exist
  const tablesExist = await checkTablesExist();
  if (tablesExist) {
    console.log('✅ Database schema already exists. Setup complete!');
    process.exit(0);
  }
  
  // Initialize database schema
  try {
    await initializeDatabase();
    console.log('✅ Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setup();
}