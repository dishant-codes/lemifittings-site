/**
 * Image Upload Handler
 * Handles file uploads to Supabase Storage and manages image URLs
 * Images are stored as files with only URLs in the database for faster loading
 */

import { supabase } from "@/integrations/supabase/client";

const STORAGE_BUCKET = "product-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export interface ImageUploadResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

/**
 * Validates if file is an image
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload JPEG, PNG, WebP, or GIF.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "File size must be less than 5MB.",
    };
  }

  return { valid: true };
};

/**
 * Generates a unique filename for the uploaded image
 */
export const generateImageFilename = (originalFileName: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalFileName.split(".").pop() || "jpg";
  return `${timestamp}-${random}.${extension}`;
};

/**
 * Creates a blob URL for preview purposes (for client-side preview before upload)
 */
export const createPreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Cleans up blob URL to prevent memory leaks
 */
export const revokePreviewUrl = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * Uploads image to Supabase Storage and returns the public URL
 * This stores the actual image file in Supabase Storage, not in the database
 */
export const uploadImageToSupabase = async (file: File): Promise<ImageUploadResult> => {
  try {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Generate unique filename
    const filename = generateImageFilename(file.name);
    const filePath = `products/${filename}`;

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase
      .storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return {
        success: false,
        error: `Upload failed: ${uploadError.message}`,
      };
    }

    // Get public URL
    const { data: publicUrlData } = supabase
      .storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return {
      success: true,
      imageUrl: publicUrlData.publicUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
};

/**
 * Deletes image from Supabase Storage
 */
export const deleteImageFromSupabase = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split(`/${STORAGE_BUCKET}/`);
    if (urlParts.length !== 2) {
      console.error("Invalid image URL format");
      return false;
    }

    const filePath = urlParts[1].split("?")[0]; // Remove query params

    const { error } = await supabase
      .storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error("Failed to delete image:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to delete image from storage:", error);
    return false;
  }
};

/**
 * Backward compatibility: alias for uploadImageToSupabase
 * Used to upload image and get URL that will be stored in database
 */
export const uploadImageToLocalStorage = async (file: File): Promise<ImageUploadResult> => {
  return uploadImageToSupabase(file);
};
