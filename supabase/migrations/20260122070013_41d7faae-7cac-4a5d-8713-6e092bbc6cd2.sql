-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  finishes TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  sizes TEXT[],
  packaging_box INTEGER NOT NULL DEFAULT 1,
  image_url TEXT,
  is_new BOOLEAN NOT NULL DEFAULT false,
  is_bestseller BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create offers table for carousel
CREATE TABLE public.offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  background_color TEXT DEFAULT '#1a1a2e',
  text_color TEXT DEFAULT '#ffffff',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_users table for simple admin authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Public read policies for products and offers (anyone can view)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Offers are viewable by everyone" 
ON public.offers 
FOR SELECT 
USING (true);

-- Admin policies (all operations allowed for authenticated users)
CREATE POLICY "Authenticated users can manage products" 
ON public.products 
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage offers" 
ON public.offers 
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Admin users table policies
CREATE POLICY "Admin users table is accessible by authenticated users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_offers_updated_at
BEFORE UPDATE ON public.offers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, description, price, category, finishes, sizes, packaging_box, is_new, is_bestseller, display_order) VALUES
('Premium Door Handle', 'Elegant door handle with modern design, perfect for contemporary interiors', 450, 'Door Handles', ARRAY['SS', 'AB', 'BLACK', 'CP'], ARRAY['4"', '6"', '8"'], 10, true, true, 1),
('Classic Cabinet Knob', 'Timeless cabinet knob suitable for kitchens and wardrobes', 85, 'Cabinet Knobs', ARRAY['CP', 'MATT', 'GOLD'], NULL, 50, false, true, 2),
('Modern Keyhole Cover', 'Sleek keyhole cover for wooden doors', 120, 'Keyhole Covers', ARRAY['SS', 'BLACK', 'RG'], NULL, 20, true, false, 3),
('Drawer Pull Handle', 'Sturdy drawer pull with ergonomic grip', 195, 'Drawer Pulls', ARRAY['AB', 'GRAPHITE', 'CP'], ARRAY['96mm', '128mm', '160mm'], 25, false, false, 4),
('Tower Bolt', 'Heavy-duty tower bolt for secure locking', 280, 'Security Fittings', ARRAY['SS', 'BLACK'], ARRAY['4"', '6"', '8"', '12"'], 20, false, true, 5),
('Door Stopper', 'Floor-mounted door stopper with rubber pad', 75, 'Door Accessories', ARRAY['SS', 'CP', 'AB'], NULL, 50, true, false, 6);

-- Insert sample offers
INSERT INTO public.offers (title, subtitle, description, background_color, is_active, display_order) VALUES
('Flat 20% Off', 'On All Door Handles', 'Use code DOOR20 for exclusive discount on premium door handles', '#2d3436', true, 1),
('New Arrivals', 'Check Our Latest Collection', 'Premium brass fittings with modern finishes now available', '#0984e3', true, 2),
('Bulk Order Discount', 'Save More on Large Orders', 'Get up to 35% off on orders above ₹10,000', '#6c5ce7', true, 3);