-- Add min_price and max_price columns to products table
-- These replace the single price column to support price ranges

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS min_price NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_price NUMERIC DEFAULT 0;

-- Add product_images column to store array of image URLs
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS product_images TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add size_prices as JSONB to store size-based pricing
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS size_prices JSONB;

-- Migrate existing price data to min_price and max_price
UPDATE public.products
SET min_price = price, max_price = price
WHERE min_price = 0 AND max_price = 0 AND price > 0;

-- Update sample products with price ranges
UPDATE public.products
SET min_price = 400, max_price = 500
WHERE name = 'Premium Door Handle' AND (min_price = 0 OR max_price = 0);

UPDATE public.products
SET min_price = 75, max_price = 95
WHERE name = 'Classic Cabinet Knob' AND (min_price = 0 OR max_price = 0);

UPDATE public.products
SET min_price = 100, max_price = 150
WHERE name = 'Modern Keyhole Cover' AND (min_price = 0 OR max_price = 0);

UPDATE public.products
SET min_price = 150, max_price = 250
WHERE name = 'Drawer Pull Handle' AND (min_price = 0 OR max_price = 0);

UPDATE public.products
SET min_price = 250, max_price = 350
WHERE name = 'Tower Bolt' AND (min_price = 0 OR max_price = 0);

UPDATE public.products
SET min_price = 50, max_price = 85
WHERE name = 'Door Stopper' AND (min_price = 0 OR max_price = 0);
