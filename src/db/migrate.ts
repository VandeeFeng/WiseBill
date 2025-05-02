import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Main migration function
async function main() {
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  // Create database client
  const sql = postgres(DATABASE_URL, { max: 1 });
  const db = drizzle(sql);
  
  // Check if tables already exist
  console.log('🔍 Checking existing tables...');
  const existingTables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('bill', 'app_settings')
  `;
  
  const tables = existingTables.map(row => row.table_name);
  
  if (tables.includes('bill')) {
    console.log('Table "bill" already exists, skipping creation');
  }
  
  if (tables.includes('app_settings')) {
    console.log('Table "app_settings" already exists, skipping creation');
  }
  
  // Only run migrations if tables don't exist
  if (!tables.includes('bill') || !tables.includes('app_settings')) {
    console.log('🔄 Running migrations...');
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('✅ Migrations completed');
  } else {
    console.log('⏭️ Skipping migrations as tables already exist');
  }

  // Set up security features and initial data
  console.log('🔒 Setting up security...');
  
  try {
    // Apply Row Level Security to the bill table
    await sql`ALTER TABLE bill ENABLE ROW LEVEL SECURITY`;
    await sql`CREATE POLICY IF NOT EXISTS bill_select_policy ON bill FOR SELECT USING (true)`;
    
    // Apply Row Level Security to app_settings
    await sql`ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY`;
    await sql`CREATE POLICY IF NOT EXISTS app_settings_read_policy ON app_settings FOR SELECT USING (auth.role() = 'authenticated')`;
    await sql`CREATE POLICY IF NOT EXISTS app_settings_admin_policy ON app_settings USING (auth.role() = 'service_role')`;
    
    // Create the validate_author_key function
    await sql`
      CREATE OR REPLACE FUNCTION validate_author_key(key_to_validate TEXT)
      RETURNS BOOLEAN
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        valid_key TEXT;
      BEGIN
        SELECT value INTO valid_key FROM app_settings WHERE key = 'author_key';
        IF valid_key IS NULL THEN
          RETURN false;
        END IF;
        RETURN key_to_validate = valid_key;
      END;
      $$;
    `;
    
    // Insert the default author key if it doesn't exist
    const defaultKey = process.env.INITIAL_AUTHOR_KEY || 'YourSecretKey';
    const forceKeyUpdate = process.env.UPDATE_AUTHOR_KEY === 'true';
    
    // Check if author key exists
    const existingKey = await sql`SELECT value FROM app_settings WHERE key = 'author_key'`;
    
    if (existingKey.length === 0) {
      // Key doesn't exist, insert it
      console.log('Creating author_key in app_settings...');
      await sql`INSERT INTO app_settings (key, value) VALUES ('author_key', ${defaultKey})`;
    } else if (forceKeyUpdate) {
      // Key exists but force update is enabled
      console.log('Updating author_key with new value from environment variable...');
      await sql`UPDATE app_settings SET value = ${defaultKey} WHERE key = 'author_key'`;
    } else {
      console.log('Author key already exists, keeping existing value (set UPDATE_AUTHOR_KEY=true to override)');
    }
    
    console.log('✅ Security setup completed');
    
  } catch (error) {
    console.error('❌ Error during setup:', error);
    process.exit(1);
  }
  
  console.log('🎉 All setup completed successfully!');
  await sql.end();
}

main().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
}); 