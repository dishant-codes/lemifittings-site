export interface SizePrice {
  size: string;
  price: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image?: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  short_description: string | null;
  price: number; // Base/default price
  size_prices?: SizePrice[] | null; // Price variations by size
  category: string;
  finishes: string[];
  product_images: string[]; // Array of multiple product images
  sizes: string[] | null;
  packaging_box: number;
  is_new: boolean;
  is_bestseller: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  author: string;
  tags: string[];
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  background_color: string | null;
  text_color: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}
