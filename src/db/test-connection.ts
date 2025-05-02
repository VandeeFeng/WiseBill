import { db } from './index';
import { sql } from 'drizzle-orm';

async function testConnection() {
  try {
    // Try a simple query
    const result = await db.execute(sql`SELECT 1`);
    console.log('Connection successful:', result);
  } catch (error) {
    console.error('Database operation failed:', error);
  }
}

testConnection(); 