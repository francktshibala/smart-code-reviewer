import { readFileSync } from 'fs';
import { join } from 'path';
import { pool } from './database';

export const initializeDatabase = async (): Promise<void> => {
  try {
    // Read SQL schema file
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    
    // Execute schema creation
    await pool.query(schema);
    
    console.log('✅ Database schema initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

// Check if tables exist
export const checkTablesExist = async (): Promise<boolean> => {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'projects', 'analyses')
      ORDER BY table_name;
    `);
    
    const tables = result.rows.map(row => row.table_name);
    const expectedTables = ['analyses', 'projects', 'users'];
    
    const allTablesExist = expectedTables.every(table => tables.includes(table));
    
    if (allTablesExist) {
      console.log('✅ All required tables exist:', tables);
    } else {
      console.log('⚠️  Missing tables. Expected:', expectedTables, 'Found:', tables);
    }
    
    return allTablesExist;
  } catch (error) {
    console.error('❌ Error checking tables:', error);
    return false;
  }
};