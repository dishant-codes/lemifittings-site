/**
 * Image Storage Configuration
 * Centralized settings for image uploads and storage
 * Images are now stored in Supabase Storage with URLs in the database
 */

export const IMAGE_CONFIG = {
  // Storage strategy: 'supabase' - Images stored in Supabase Storage, URLs in database
  STORAGE_STRATEGY: "supabase" as const,

  // Maximum file size (5MB)
  MAX_FILE_SIZE: 5 * 1024 * 1024,

  // Allowed MIME types
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],

  // Supabase Storage bucket name
  STORAGE_BUCKET: "product-images",

  // Storage path for products
  PRODUCTS_PATH: "products",

  // LocalStorage key prefix for images (for backward compatibility)
  STORAGE_KEY_PREFIX: "img_",
} as const;

export type StorageStrategy = typeof IMAGE_CONFIG.STORAGE_STRATEGY;
