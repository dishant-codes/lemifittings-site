-- =====================================================
-- DATABASE MIGRATION: Add Color/Finish Images Support
-- =====================================================
-- This migration adds support for color-specific images
-- Each product can now have different images for different finishes

-- =====================================================
-- 1. ADD NEW COLUMN TO PRODUCTS TABLE
-- =====================================================

ALTER TABLE products
ADD COLUMN finish_images JSONB DEFAULT NULL;

-- Add comment explaining the column
COMMENT ON COLUMN products.finish_images IS 'JSON object mapping finish names to image URLs. Example: {"Black": "url/black.jpg", "Gold": "url/gold.jpg"}';

-- =====================================================
-- 2. CREATE INDEX FOR BETTER PERFORMANCE (Optional)
-- =====================================================

-- This helps with queries that filter by finish_images existence
CREATE INDEX IF NOT EXISTS idx_products_finish_images 
ON products USING GIN (finish_images);

-- =====================================================
-- 3. VERIFY SCHEMA CHANGE
-- =====================================================

-- Check the updated products table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- =====================================================
-- 4. EXAMPLE: INSERT PRODUCT WITH COLOR IMAGES
-- =====================================================

INSERT INTO products (
    id,
    name,
    description,
    price,
    category,
    finishes,
    finish_images,
    sizes,
    packaging_box,
    image_url,
    is_new,
    is_bestseller,
    display_order,
    created_at,
    updated_at
) VALUES (
    'crystal-knob-001',
    'Crystal Thumb Knob',
    'Beautiful crystal knob available in vibrant colors',
    500,
    'knobs',
    ARRAY['Red', 'Blue', 'Yellow', 'Pink', 'Green', 'Clear'],
    jsonb_build_object(
        'Red', 'https://storage.example.com/crystal-red.jpg',
        'Blue', 'https://storage.example.com/crystal-blue.jpg',
        'Yellow', 'https://storage.example.com/crystal-yellow.jpg',
        'Pink', 'https://storage.example.com/crystal-pink.jpg',
        'Green', 'https://storage.example.com/crystal-green.jpg',
        'Clear', 'https://storage.example.com/crystal-clear.jpg'
    ),
    NULL,
    18,
    'https://storage.example.com/crystal-default.jpg',
    true,
    true,
    1,
    NOW(),
    NOW()
);

-- =====================================================
-- 5. EXAMPLE: UPDATE EXISTING PRODUCT WITH COLOR IMAGES
-- =====================================================

UPDATE products
SET finish_images = jsonb_build_object(
    'Black', 'https://storage.example.com/bt-3004-black.jpg',
    'Gold', 'https://storage.example.com/bt-3004-gold.jpg',
    'Rosewood', 'https://storage.example.com/bt-3004-rosewood.jpg',
    'Graphite', 'https://storage.example.com/bt-3004-graphite.jpg'
),
updated_at = NOW()
WHERE id = 'bt-3004' AND category = 'knobs';

-- =====================================================
-- 6. UPDATE MULTIPLE PRODUCTS AT ONCE
-- =====================================================

-- Update all knobs with color images mapping
UPDATE products
SET finish_images = 
    CASE 
        WHEN id = 'bt-714' THEN jsonb_build_object(
            'SS', 'https://storage.example.com/bt-714-ss.jpg',
            'AB', 'https://storage.example.com/bt-714-ab.jpg',
            'Black', 'https://storage.example.com/bt-714-black.jpg'
        )
        WHEN id = 'bt-715' THEN jsonb_build_object(
            'SS', 'https://storage.example.com/bt-715-ss.jpg',
            'AB', 'https://storage.example.com/bt-715-ab.jpg',
            'Black', 'https://storage.example.com/bt-715-black.jpg'
        )
        WHEN id = 'chocolate-knob' THEN jsonb_build_object(
            'CP', 'https://storage.example.com/choc-cp.jpg',
            'Matt', 'https://storage.example.com/choc-matt.jpg',
            'Gold', 'https://storage.example.com/choc-gold.jpg',
            'AB', 'https://storage.example.com/choc-ab.jpg',
            'RG', 'https://storage.example.com/choc-rg.jpg',
            'Graphite', 'https://storage.example.com/choc-graphite.jpg'
        )
        ELSE finish_images
    END,
updated_at = NOW()
WHERE category = 'knobs';

-- =====================================================
-- 7. QUERY: GET PRODUCT WITH COLOR IMAGES
-- =====================================================

SELECT 
    id,
    name,
    price,
    category,
    finishes,
    finish_images,
    image_url,
    is_new,
    is_bestseller,
    created_at,
    updated_at
FROM products
WHERE id = 'bt-3004'
LIMIT 1;

-- =====================================================
-- 8. QUERY: GET SPECIFIC FINISH IMAGE
-- =====================================================

-- Get the image URL for a specific finish of a product
SELECT 
    id,
    name,
    finish_images->>'Black' AS black_image_url,
    finish_images->>'Gold' AS gold_image_url,
    image_url AS default_image
FROM products
WHERE id = 'bt-3004';

-- Alternative: Using ->> (text) operator for specific key
SELECT 
    id,
    name,
    finish_images->'Black' AS black_image_object,
    finish_images->>'Black' AS black_image_url  -- Returns just the string
FROM products
WHERE finish_images ? 'Black';  -- ? operator checks if key exists

-- =====================================================
-- 9. QUERY: LIST ALL PRODUCTS WITH COLOR IMAGES
-- =====================================================

SELECT 
    id,
    name,
    category,
    price,
    finishes,
    jsonb_array_length(finish_images) AS color_image_count,
    image_url,
    created_at
FROM products
WHERE finish_images IS NOT NULL
ORDER BY created_at DESC;

-- =====================================================
-- 10. QUERY: PRODUCTS WITH COLOR IMAGES FOR SPECIFIC FINISH
-- =====================================================

-- Find all products that have an image for "Gold" finish
SELECT 
    id,
    name,
    category,
    finish_images->>'Gold' AS gold_image_url
FROM products
WHERE finish_images ? 'Gold'
AND finish_images->>'Gold' IS NOT NULL
ORDER BY name;

-- =====================================================
-- 11. QUERY: COUNT COLOR IMAGES PER PRODUCT
-- =====================================================

SELECT 
    id,
    name,
    array_length(finishes, 1) AS total_finishes,
    jsonb_object_keys(finish_images) AS finish_with_image
FROM products
WHERE finish_images IS NOT NULL
ORDER BY id;

-- =====================================================
-- 12. ADD NEW COLOR IMAGE TO EXISTING PRODUCT
-- =====================================================

-- Add a new finish image to product without overwriting others
UPDATE products
SET finish_images = finish_images || jsonb_build_object('NewColor', 'https://storage.example.com/new-color.jpg'),
    updated_at = NOW()
WHERE id = 'bt-3004';

-- =====================================================
-- 13. REMOVE A COLOR IMAGE FROM PRODUCT
-- =====================================================

-- Remove a specific finish image
UPDATE products
SET finish_images = finish_images - 'Gold',
    updated_at = NOW()
WHERE id = 'bt-3004' AND finish_images ? 'Gold';

-- =====================================================
-- 14. CLEAR ALL COLOR IMAGES FROM PRODUCT
-- =====================================================

UPDATE products
SET finish_images = NULL,
    updated_at = NOW()
WHERE id = 'bt-3004';

-- =====================================================
-- 15. QUERY: PRODUCTS WITHOUT COLOR IMAGES
-- =====================================================

-- Find products that don't have finish_images set
SELECT 
    id,
    name,
    category,
    finishes,
    image_url
FROM products
WHERE finish_images IS NULL
ORDER BY category, name;

-- =====================================================
-- 16. QUERY: PRODUCTS WITH INCOMPLETE COLOR COVERAGE
-- =====================================================

-- Find products where not all finishes have images
SELECT 
    id,
    name,
    finishes,
    jsonb_object_keys(finish_images) AS finishes_with_images,
    array_length(finishes, 1) AS total_finishes,
    jsonb_object_keys(finish_images)::text[] AS covered_finishes
FROM products
WHERE finish_images IS NOT NULL
AND array_length(finishes, 1) > jsonb_object_length(finish_images);

-- =====================================================
-- 17. BULK UPDATE: SET FINISH IMAGES FROM JSON FILE
-- =====================================================

-- If you have a JSON file with all product color images
-- You can import and update like this:

WITH color_data AS (
    SELECT 
        'bt-714' AS product_id,
        jsonb_build_object(
            'SS', 'https://storage.example.com/ss.jpg',
            'AB', 'https://storage.example.com/ab.jpg'
        ) AS images
    UNION ALL
    SELECT 
        'bt-715',
        jsonb_build_object(
            'SS', 'https://storage.example.com/ss.jpg',
            'AB', 'https://storage.example.com/ab.jpg'
        )
)
UPDATE products p
SET finish_images = cd.images,
    updated_at = NOW()
FROM color_data cd
WHERE p.id = cd.product_id;

-- =====================================================
-- 18. VALIDATE: CHECK DATA INTEGRITY
-- =====================================================

-- Verify all finish names in finish_images exist in finishes array
SELECT 
    id,
    name,
    finishes,
    jsonb_object_keys(finish_images)::text[] AS image_finishes,
    (SELECT array_agg(finish) FROM jsonb_object_keys(finish_images) AS finish) AS invalid_finishes
FROM products
WHERE finish_images IS NOT NULL
AND EXISTS (
    SELECT 1 
    FROM jsonb_object_keys(finish_images) AS finish_with_image
    WHERE NOT (finish_with_image = ANY(finishes))
);

-- =====================================================
-- 19. QUERY: GET FULL PRODUCT DATA FOR FRONTEND
-- =====================================================

-- Query that returns all data needed for frontend
SELECT 
    id,
    name,
    description,
    price,
    category,
    finishes,
    finish_images,
    sizes,
    packaging_box,
    image_url,
    is_new,
    is_bestseller,
    display_order,
    created_at,
    updated_at
FROM products
WHERE id = 'bt-3004'
LIMIT 1;

-- =====================================================
-- 20. EXPORT: GET ALL PRODUCTS WITH FINISH IMAGES AS JSON
-- =====================================================

SELECT 
    jsonb_build_object(
        'id', id,
        'name', name,
        'price', price,
        'finishes', finishes,
        'finish_images', finish_images,
        'image_url', image_url
    ) AS product_json
FROM products
WHERE finish_images IS NOT NULL
ORDER BY id;

-- =====================================================
-- 21. MIGRATION ROLLBACK (IF NEEDED)
-- =====================================================

-- To remove the new column and revert changes
ALTER TABLE products
DROP COLUMN finish_images CASCADE;

-- Remove the index
DROP INDEX IF EXISTS idx_products_finish_images;

-- =====================================================
-- 22. PRACTICAL EXAMPLE: Complete Product Setup
-- =====================================================

-- Example: Setting up BT-3004 Wooden Handle with 4 colors
BEGIN;

-- Update or insert product
INSERT INTO products (
    id, name, description, price, category,
    finishes, finish_images, sizes, packaging_box,
    image_url, is_new, is_bestseller, display_order
) VALUES (
    'bt-3004',
    'BT-3004 Wooden Handle',
    'Premium wooden handle for doors and cabinets',
    230,
    'knobs',
    ARRAY['Black', 'Gold', 'Rosewood', 'Graphite'],
    jsonb_build_object(
        'Black', 'https://storage.example.com/products/bt-3004-black.jpg',
        'Gold', 'https://storage.example.com/products/bt-3004-gold.jpg',
        'Rosewood', 'https://storage.example.com/products/bt-3004-rosewood.jpg',
        'Graphite', 'https://storage.example.com/products/bt-3004-graphite.jpg'
    ),
    ARRAY['4"', '6"', '8"'],
    2,
    'https://storage.example.com/products/bt-3004-default.jpg',
    false,
    true,
    5
) ON CONFLICT (id) DO UPDATE SET
    finish_images = EXCLUDED.finish_images,
    updated_at = NOW();

COMMIT;

-- =====================================================
-- 23. STATISTICS: PRODUCT IMAGE COVERAGE
-- =====================================================

-- Get statistics on color image coverage
SELECT 
    category,
    COUNT(*) AS total_products,
    COUNT(CASE WHEN finish_images IS NOT NULL THEN 1 END) AS products_with_color_images,
    ROUND(
        100.0 * COUNT(CASE WHEN finish_images IS NOT NULL THEN 1 END) / COUNT(*),
        2
    ) AS coverage_percentage,
    AVG(jsonb_object_length(finish_images))::NUMERIC(10, 2) AS avg_images_per_product
FROM products
GROUP BY category
ORDER BY coverage_percentage DESC;

-- =====================================================
-- 24. TROUBLESHOOTING: Check for NULL or Invalid Data
-- =====================================================

-- Find products with empty finish_images
SELECT id, name, finish_images
FROM products
WHERE finish_images = 'null'::jsonb OR jsonb_object_length(finish_images) = 0;

-- Find products with finish images but no finishes array
SELECT id, name, finishes, finish_images
FROM products
WHERE finish_images IS NOT NULL AND finishes IS NULL;

-- =====================================================
-- END OF MIGRATION SCRIPT
-- =====================================================
