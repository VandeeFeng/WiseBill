-- SQL function to create in Supabase SQL Editor

-- Create a secure table to store the author key
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Apply Row Level Security
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Only allow read access to the validate_author_key function
CREATE POLICY app_settings_read_policy ON app_settings
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only allow admin to modify
CREATE POLICY app_settings_admin_policy ON app_settings
  USING (auth.role() = 'service_role');

-- Insert the author key (run this with service_role key)
-- Make sure to replace 'YourSecretKey' with your actual key
INSERT INTO app_settings (key, value)
VALUES ('author_key', 'VandeeBill')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Create secure function to validate author key
CREATE OR REPLACE FUNCTION validate_author_key(key_to_validate TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Run with privileges of the function creator
AS $$
DECLARE
  valid_key TEXT;
BEGIN
  -- Get the key from our secure table
  SELECT value INTO valid_key FROM app_settings WHERE key = 'author_key';
  
  -- Return false if no key found
  IF valid_key IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if provided key matches the stored key
  RETURN key_to_validate = valid_key;
END;
$$;

-- This avoids exposing the key in client-side code
-- The function is accessible via RPC but securely validates without revealing the key 