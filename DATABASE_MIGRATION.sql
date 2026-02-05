-- Migration: Add Blog Support and Update Product Schema
-- Database: Supabase PostgreSQL

-- ============================================================================
-- 1. UPDATE PRODUCTS TABLE
-- ============================================================================

-- Add new columns to products table if they don't exist
ALTER TABLE products
ADD COLUMN IF NOT EXISTS product_images TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS size_prices JSONB;

-- Drop old columns if they exist (optional - only if migrating from old schema)
-- ALTER TABLE products DROP COLUMN IF NOT EXISTS image_url;
-- ALTER TABLE products DROP COLUMN IF EXISTS finish_images;

-- Create index on product_images for better query performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(id);

-- ============================================================================
-- 2. CREATE BLOGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image VARCHAR(500),
  author VARCHAR(255),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_published BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP NULL,
  
  CONSTRAINT blogs_title_not_empty CHECK (title <> ''),
  CONSTRAINT blogs_slug_not_empty CHECK (slug <> ''),
  CONSTRAINT blogs_content_not_empty CHECK (content <> '')
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_is_published ON blogs(is_published);
CREATE INDEX IF NOT EXISTS idx_blogs_published_at ON blogs(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_tags ON blogs USING GIN(tags);

-- ============================================================================
-- 3. CREATE RLS POLICIES FOR BLOGS
-- ============================================================================

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view published blogs
CREATE POLICY IF NOT EXISTS "allow_read_published_blogs" ON blogs
  FOR SELECT
  USING (is_published = true);

-- Policy: Admin users can manage all blogs
-- (Adjust based on your auth setup)
CREATE POLICY IF NOT EXISTS "allow_admin_manage_blogs" ON blogs
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE email LIKE '%@admin.%'
    )
  );

-- ============================================================================
-- 4. CREATE FUNCTION TO UPDATE UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_blogs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER IF NOT EXISTS update_blogs_updated_at_trigger
  BEFORE UPDATE ON blogs
  FOR EACH ROW
  EXECUTE FUNCTION update_blogs_updated_at();

-- ============================================================================
-- 5. EXAMPLE QUERIES
-- ============================================================================

-- Get all published blogs ordered by published date
-- SELECT * FROM blogs WHERE is_published = true ORDER BY published_at DESC;

-- Search blogs by title or excerpt
-- SELECT * FROM blogs WHERE is_published = true AND (title ILIKE '%search%' OR excerpt ILIKE '%search%') ORDER BY published_at DESC;

-- Filter blogs by tag
-- SELECT * FROM blogs WHERE is_published = true AND tags @> ARRAY['design'] ORDER BY published_at DESC;

-- Get blog by slug
-- SELECT * FROM blogs WHERE slug = 'my-blog-post' AND is_published = true;

-- Increment view count
-- UPDATE blogs SET view_count = view_count + 1 WHERE id = '...';

-- Get trending blogs (most viewed)
-- SELECT * FROM blogs WHERE is_published = true ORDER BY view_count DESC LIMIT 10;

-- ============================================================================
-- 6. DATA MIGRATION (if upgrading from old schema)
-- ============================================================================

-- If you have existing products with single image_url, convert to array:
-- UPDATE products 
-- SET product_images = ARRAY[image_url]::TEXT[]
-- WHERE image_url IS NOT NULL AND (product_images IS NULL OR array_length(product_images, 1) IS NULL);

-- ============================================================================
-- 7. CLEANUP (Optional - only if old columns no longer needed)
-- ============================================================================

-- Once migration is confirmed working, optionally remove old columns:
-- ALTER TABLE products DROP COLUMN IF EXISTS image_url CASCADE;
-- ALTER TABLE products DROP COLUMN IF EXISTS finish_images CASCADE;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
