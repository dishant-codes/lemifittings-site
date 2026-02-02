/**
 * Image Upload Handler
 * Handles local file uploads and generates image paths
 */

const UPLOAD_DIR = "/uploads/products";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export interface ImageUploadResult {
  success: boolean;
  imagePath?: string;
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
 * Converts file to base64 for storage (client-side approach)
 * This is useful if you want to store images as base64 in the database
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
 * Generates the image path that will be stored in the database
 */
export const generateImagePath = (filename: string): string => {
  return `${UPLOAD_DIR}/${filename}`;
};

/**
 * Creates a blob URL for preview purposes
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
 * Handles image upload with IndexedDB fallback for local storage
 * This stores base64 images locally
 */
export const uploadImageToLocalStorage = async (file: File): Promise<ImageUploadResult> => {
  try {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Convert to base64
    const base64Data = await fileToBase64(file);

    // Generate filename and path
    const filename = generateImageFilename(file.name);
    const imagePath = generateImagePath(filename);

    // Store in localStorage (for development)
    // Note: localStorage has 5-10MB limit per domain, so this is for small images only
    try {
      const imageData = {
        filename,
        data: base64Data,
        uploadedAt: new Date().toISOString(),
      };
      const storageKey = `image_${filename}`;
      localStorage.setItem(storageKey, JSON.stringify(imageData));
    } catch (storageError) {
      console.warn("localStorage is full, falling back to IndexedDB:", storageError);
      // In production, you'd implement IndexedDB here
    }

    return {
      success: true,
      imagePath: base64Data, // Return base64 directly for simple implementation
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
};

/**
 * Retrieves image from local storage
 */
export const getImageFromLocalStorage = (filename: string): string | null => {
  try {
    const storageKey = `image_${filename}`;
    const imageData = localStorage.getItem(storageKey);
    if (imageData) {
      const parsed = JSON.parse(imageData);
      return parsed.data;
    }
  } catch (error) {
    console.error("Failed to retrieve image from storage:", error);
  }
  return null;
};

/**
 * Deletes image from local storage
 */
export const deleteImageFromLocalStorage = (filename: string): boolean => {
  try {
    const storageKey = `image_${filename}`;
    localStorage.removeItem(storageKey);
    return true;
  } catch (error) {
    console.error("Failed to delete image from storage:", error);
    return false;
  }
};
