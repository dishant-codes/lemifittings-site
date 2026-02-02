/**
 * Image Storage Configuration
 * Centralized settings for image uploads and storage
 */

export const IMAGE_CONFIG = {
  // Storage strategy: 'localStorage' | 'indexeddb' | 'server'
  STORAGE_STRATEGY: "localStorage" as const,

  // Maximum file size (5MB)
  MAX_FILE_SIZE: 5 * 1024 * 1024,

  // Allowed MIME types
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],

  // Upload directory in public folder
  UPLOAD_DIR: "/uploads/products",

  // LocalStorage key prefix for images
  STORAGE_KEY_PREFIX: "img_",

  // IndexedDB settings (for future use with larger storage)
  INDEXED_DB: {
    DB_NAME: "lemifittings_images",
    STORE_NAME: "product_images",
    VERSION: 1,
  },
} as const;

export type StorageStrategy = typeof IMAGE_CONFIG.STORAGE_STRATEGY;
