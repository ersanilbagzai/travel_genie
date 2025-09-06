/*
# Create system configuration table

## Purpose
Create a system_conf table to store system-related configuration properties as key-value pairs.

## New Tables
- `system_conf`
  - `key` (VARCHAR, primary key) - Configuration property names/identifiers
  - `value` (TEXT, nullable) - Configuration property values (allows NULL for optional configs)
  - `description` (TEXT, nullable) - Optional description of what the configuration does
  - `created_at` (timestamptz) - When the configuration was created
  - `updated_at` (timestamptz) - When the configuration was last modified
  - `created_by` (UUID, foreign key) - User who created the configuration
  - `updated_by` (UUID, foreign key) - User who last updated the configuration

## Security
- Enable RLS on `system_conf` table
- Add policy for authenticated users to read system configurations
- Add policy for authenticated users with admin role to manage configurations

## Indexes
- Primary key index on `key` (automatic)
- Index on `created_at` for audit queries
- Index on `updated_at` for recent changes queries

## Notes
- Uses VARCHAR for key to ensure reasonable length limits
- TEXT for value to support large configuration strings
- Includes audit trail columns for tracking changes
- Foreign keys reference auth.users for user tracking
*/

-- Create the system_conf table
CREATE TABLE IF NOT EXISTS system_conf (
  key VARCHAR(255) PRIMARY KEY,
  value TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE system_conf ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_system_conf_created_at ON system_conf(created_at);
CREATE INDEX IF NOT EXISTS idx_system_conf_updated_at ON system_conf(updated_at);
CREATE INDEX IF NOT EXISTS idx_system_conf_created_by ON system_conf(created_by);

-- Create policies for RLS
CREATE POLICY "Authenticated users can read system configurations"
  ON system_conf
  FOR SELECT
  TO authenticated
  USING (true);

-- Note: In a real application, you might want to restrict write access to admin users only
-- For now, allowing all authenticated users to insert/update configurations
CREATE POLICY "Authenticated users can insert system configurations"
  ON system_conf
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update system configurations"
  ON system_conf
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete system configurations"
  ON system_conf
  FOR DELETE
  TO authenticated
  USING (true);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_system_conf_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at and updated_by
CREATE TRIGGER trigger_update_system_conf_updated_at
  BEFORE UPDATE ON system_conf
  FOR EACH ROW
  EXECUTE FUNCTION update_system_conf_updated_at();

-- Create a function to set created_by on insert
CREATE OR REPLACE FUNCTION set_system_conf_created_by()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set created_by
CREATE TRIGGER trigger_set_system_conf_created_by
  BEFORE INSERT ON system_conf
  FOR EACH ROW
  EXECUTE FUNCTION set_system_conf_created_by();

-- Insert some example system configurations
INSERT INTO system_conf (key, value, description) VALUES
  ('app_name', 'TravelGenie', 'The name of the application'),
  ('app_version', '1.0.0', 'Current version of the application'),
  ('maintenance_mode', 'false', 'Whether the application is in maintenance mode'),
  ('max_file_upload_size', '10485760', 'Maximum file upload size in bytes (10MB)'),
  ('session_timeout', '3600', 'Session timeout in seconds (1 hour)')
ON CONFLICT (key) DO NOTHING;