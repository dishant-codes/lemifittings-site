export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  finishes: string[];
  sizes: string[] | null;
  packaging_box: number;
  image_url: string | null;
  is_new: boolean;
  is_bestseller: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
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
