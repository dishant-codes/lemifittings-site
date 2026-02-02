import { useCallback, useEffect, useState } from "react";
import { IMAGE_CONFIG } from "@/config/imageConfig";

interface ImageMetadata {
  filename: string;
  uploadedAt: string;
  mimeType: string;
  size: number;
}

/**
 * Hook for managing local image storage
 * Provides utilities for uploading, retrieving, and deleting images
 */
export function useLocalImageStorage() {
  const [storageUsage, setStorageUsage] = useState<number>(0);
  const [imageCount, setImageCount] = useState<number>(0);

  // Calculate current storage usage
  const calculateStorageUsage = useCallback(() => {
    try {
      let totalSize = 0;
      let count = 0;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(IMAGE_CONFIG.STORAGE_KEY_PREFIX)) {
          count++;
          const data = localStorage.getItem(key);
          if (data) {
            totalSize += data.length;
          }
        }
      }

      setStorageUsage(totalSize);
      setImageCount(count);
      return { totalSize, count };
    } catch (error) {
      console.error("Failed to calculate storage usage:", error);
      return { totalSize: 0, count: 0 };
    }
  }, []);

  // Update storage usage on mount
  useEffect(() => {
    calculateStorageUsage();
  }, [calculateStorageUsage]);

  // Store image with metadata
  const storeImage = useCallback(
    (filename: string, base64Data: string, mimeType: string = "image/jpeg") => {
      try {
        const metadata: ImageMetadata = {
          filename,
          uploadedAt: new Date().toISOString(),
          mimeType,
          size: base64Data.length,
        };

        const storageKey = `${IMAGE_CONFIG.STORAGE_KEY_PREFIX}${filename}`;
        const imageRecord = {
          metadata,
          data: base64Data,
        };

        localStorage.setItem(storageKey, JSON.stringify(imageRecord));
        calculateStorageUsage();
        return true;
      } catch (error) {
        console.error("Failed to store image:", error);
        return false;
      }
    },
    [calculateStorageUsage]
  );

  // Retrieve image
  const getImage = useCallback((filename: string): string | null => {
    try {
      const storageKey = `${IMAGE_CONFIG.STORAGE_KEY_PREFIX}${filename}`;
      const imageRecord = localStorage.getItem(storageKey);

      if (!imageRecord) return null;

      const parsed = JSON.parse(imageRecord);
      return parsed.data;
    } catch (error) {
      console.error("Failed to retrieve image:", error);
      return null;
    }
  }, []);

  // Get image metadata
  const getImageMetadata = useCallback((filename: string): ImageMetadata | null => {
    try {
      const storageKey = `${IMAGE_CONFIG.STORAGE_KEY_PREFIX}${filename}`;
      const imageRecord = localStorage.getItem(storageKey);

      if (!imageRecord) return null;

      const parsed = JSON.parse(imageRecord);
      return parsed.metadata;
    } catch (error) {
      console.error("Failed to retrieve metadata:", error);
      return null;
    }
  }, []);

  // Delete image
  const deleteImage = useCallback(
    (filename: string) => {
      try {
        const storageKey = `${IMAGE_CONFIG.STORAGE_KEY_PREFIX}${filename}`;
        localStorage.removeItem(storageKey);
        calculateStorageUsage();
        return true;
      } catch (error) {
        console.error("Failed to delete image:", error);
        return false;
      }
    },
    [calculateStorageUsage]
  );

  // List all stored images
  const listImages = useCallback((): ImageMetadata[] => {
    try {
      const images: ImageMetadata[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(IMAGE_CONFIG.STORAGE_KEY_PREFIX)) {
          const imageRecord = localStorage.getItem(key);
          if (imageRecord) {
            const parsed = JSON.parse(imageRecord);
            images.push(parsed.metadata);
          }
        }
      }

      return images;
    } catch (error) {
      console.error("Failed to list images:", error);
      return [];
    }
  }, []);

  // Clear all images
  const clearAllImages = useCallback(() => {
    try {
      const keysToDelete: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(IMAGE_CONFIG.STORAGE_KEY_PREFIX)) {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach((key) => localStorage.removeItem(key));
      calculateStorageUsage();
      return true;
    } catch (error) {
      console.error("Failed to clear images:", error);
      return false;
    }
  }, [calculateStorageUsage]);

  // Format bytes to readable format
  const formatStorageSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return {
    storageUsage,
    imageCount,
    storeImage,
    getImage,
    getImageMetadata,
    deleteImage,
    listImages,
    clearAllImages,
    formatStorageSize,
    calculateStorageUsage,
  };
}
