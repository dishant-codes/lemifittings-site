-- ============================================
-- CLEAR ALL IMAGES FROM DATABASE
-- Keep all product/offer/blog details intact
-- Only clears image URLs/data
-- ============================================

-- 1. CLEAR PRODUCT IMAGES (array of image URLs)
UPDATE products 
SET product_images = ARRAY[]::text[]
WHERE product_images IS NOT NULL;

-- 2. CLEAR BLOG FEATURED IMAGES
UPDATE blogs 
SET featured_image = NULL
WHERE featured_image IS NOT NULL;

-- 3. CLEAR OFFER IMAGES (if they have images)
UPDATE offers 
SET image_url = NULL
WHERE image_url IS NOT NULL;

-- 4. VERIFY IMAGES ARE CLEARED
-- Run these SELECT queries to confirm:
SELECT id, name, product_images FROM products LIMIT 5;
SELECT id, title, featured_image FROM blogs LIMIT 5;
SELECT id, title, image_url FROM offers LIMIT 5;

-- ============================================
-- IMPORTANT NOTES
-- ============================================
-- ✅ Product names, descriptions, prices - KEPT
-- ✅ Blog titles, content, metadata - KEPT
-- ✅ Offer details - KEPT
-- ❌ Only image URLs/data - CLEARED

-- If you want to UNDO this (restore from backup):
-- Contact your database administrator

-- ============================================
-- ROLLBACK (if needed immediately)
-- ============================================
-- If you need to undo this right after running it,
-- Supabase keeps a recovery window - contact support
-- For local testing, restore from database backup

-- ============================================
-- CATEGORY IMAGES (if applicable)
-- ============================================
-- If you also want to clear category images:
/*
UPDATE categories 
SET image = NULL
WHERE image IS NOT NULL;
*/

-- ============================================
-- CLEAR INDIVIDUAL PRODUCT IMAGES
-- ============================================
-- To clear images from a specific product:
/*
UPDATE products 
SET product_images = ARRAY[]::text[]
WHERE id = 'product-id-here';

OR

UPDATE products 
SET product_images = ARRAY[]::text[]
WHERE name = 'Product Name Here';
*/

-- ============================================
-- CLEAR IMAGES OLDER THAN DATE
-- ============================================
-- To clear images from products created before a date:
/*
UPDATE products 
SET product_images = ARRAY[]::text[]
WHERE created_at < '2024-01-01'::timestamp;
*/
