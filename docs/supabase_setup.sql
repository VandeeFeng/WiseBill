-- WiseBill Supabase Setup Script
-- Run this in your Supabase SQL Editor to initialize the database

-- 1. Create the bill table for storing transactions
CREATE TABLE IF NOT EXISTS bill (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "Account" TEXT NOT NULL,
  "Amount" NUMERIC(10, 2) NOT NULL,
  "Date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "Description" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Apply RLS to the bill table
ALTER TABLE bill ENABLE ROW LEVEL SECURITY;

-- Allow anyone with key to read all rows
CREATE POLICY bill_select_policy ON bill
  FOR SELECT USING (true);

-- Create RPC functions for insert/update/delete that will validate the author key

-- 2. Setup author key security

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

-- 3. Insert the default author key
-- IMPORTANT: Replace 'YourSecretKey' with your desired author key value
INSERT INTO app_settings (key, value)
VALUES ('author_key', 'YourSecretKey')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 4. Create sample data (optional)
INSERT INTO bill ("Account", "Amount", "Date", "Description")
VALUES 
  ('工商银行', 199.99, NOW() - INTERVAL '1 day', '购物'),
  ('招商银行', 88.50, NOW() - INTERVAL '2 days', '餐饮'),
  ('建设银行', 35.00, NOW() - INTERVAL '3 days', '交通'); 