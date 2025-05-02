import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { config } from 'dotenv';

// Load environment variables
config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const { hostname: host, port, username: user, password, pathname } = new URL(connectionString);

// Configure connection for Supabase
const client = postgres({
  host,
  port: Number(port),
  user,
  password,
  database: pathname.slice(1),
  ssl: {
    rejectUnauthorized: false
  }
});

export const db = drizzle(client, { schema }); 