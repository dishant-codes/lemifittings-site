-- Create Categories Table with Image Support
-- This allows storing category images in the database

CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT categories_name_not_empty CHECK (name <> ''),
  CONSTRAINT categories_description_not_empty CHECK (description <> '')
);

-- Create index for display order
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);

-- Enable RLS for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view categories
CREATE POLICY IF NOT EXISTS "allow_read_categories" ON categories
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can manage categories
CREATE POLICY IF NOT EXISTS "allow_authenticated_manage_categories" ON categories
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER IF NOT EXISTS update_categories_updated_at_trigger
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_categories_updated_at();

-- Insert default categories
INSERT INTO categories (id, name, description, image, display_order) VALUES
  ('knobs', 'Knobs', 'Premium cabinet and furniture knobs', NULL, 1),
  ('handles', 'Handles', 'Quality handles for all applications', NULL, 2),
  ('keyholes', 'Key Holes', 'Decorative keyholes and escutcheons', NULL, 3),
  ('accessories', 'Accessories', 'Hardware accessories and fittings', NULL, 4)
ON CONFLICT (id) DO NOTHING;
