-- Fix: Remove Character Limits from Blogs Table
-- This script changes VARCHAR columns to TEXT (unlimited) to allow long content

-- ============================================================================
-- 1. ALTER BLOGS TABLE - REMOVE CHARACTER LIMITS
-- ============================================================================

-- Change title from VARCHAR(255) to TEXT (unlimited)
ALTER TABLE blogs
ALTER COLUMN title TYPE TEXT;

-- Change featured_image from VARCHAR(500) to TEXT (unlimited)
ALTER TABLE blogs
ALTER COLUMN featured_image TYPE TEXT;

-- Change author from VARCHAR(255) to TEXT (unlimited) if it exists
ALTER TABLE blogs
ALTER COLUMN author TYPE TEXT;

-- ============================================================================
-- 2. VERIFY CHANGES (run these queries to check)
-- ============================================================================
-- SELECT column_name, data_type, character_maximum_length 
-- FROM information_schema.columns 
-- WHERE table_name = 'blogs' 
-- ORDER BY ordinal_position;

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Changes made:
-- ✅ title: VARCHAR(255) → TEXT (unlimited length)
-- ✅ featured_image: VARCHAR(500) → TEXT (unlimited length)
-- ✅ author: VARCHAR(255) → TEXT (unlimited length)
-- ✅ excerpt: Already TEXT (no limit)
-- ✅ content: Already TEXT (no limit)
--
-- Now you can store:
-- - Very long blog post content
-- - Large image URLs
-- - Long author names
-- - Extended titles
-- ============================================================================
