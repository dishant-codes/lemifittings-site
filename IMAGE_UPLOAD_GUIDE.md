# Local Image Upload Feature - Implementation Guide

## Overview
This feature adds local image upload capability to the admin dashboard for product images. Images are stored in the browser's localStorage or IndexedDB and can be fetched across the website.

## Architecture

### Components & Files
- **ImageUploadField.tsx** - Reusable upload component with preview
- **imageUpload.ts** - Core upload logic and utilities
- **imageConfig.ts** - Centralized configuration
- **ProductsManager.tsx** - Updated admin dashboard with image upload

### Storage Strategy
Currently uses **localStorage** for simplicity. Each image is:
1. Validated (type & size)
2. Converted to Base64
3. Stored in localStorage with metadata
4. Retrieved as data URL when needed

## How It Works

### 1. Uploading an Image

When admin uploads an image:
```typescript
// In ImageUploadField component
1. User selects file
2. validateImageFile() checks type & size
3. fileToBase64() converts to data URL
4. uploadImageToLocalStorage() stores in localStorage
5. Preview displays immediately
6. Base64 string saved to product data
```

### 2. Storing in Database

The Base64 image data is stored directly in the `image_url` field:
```typescript
// In ProductsManager
const productData = {
  name: "Product Name",
  image_url: "data:image/jpeg;base64,/9j/4AAQSkZJRg...", // Base64 data
  // ... other fields
};
```

### 3. Displaying on Website

On the website, images are retrieved automatically:
```typescript
// In ProductCard or any component
<img src={product.image_url} alt={product.name} />
// Works because product.image_url contains data URL
```

## Implementation Details

### Storage Limits
- **localStorage**: ~5-10MB per domain (typical)
- Base64 increases data size by ~33%
- Suitable for ~50-100 high-quality product images

### File Limitations
- Max file size: 5MB
- Supported formats: JPEG, PNG, WebP, GIF
- Images auto-compressed by browser

### Browser Support
- Works in all modern browsers
- Data persists across sessions
- Data erased when localStorage is cleared

## How to Use in Admin Dashboard

### Adding a Product with Image

1. Click "Add Product" button
2. Fill in product details
3. Click upload area or "Click to upload image"
4. Select image file
5. Preview displays automatically
6. Image is ready to save
7. Click "Create Product"

### Editing Product Image

1. Click edit (pencil icon) on product
2. Click "X" on existing image to remove
3. Upload new image using same process
4. Click "Update Product"

## API Reference

### Image Upload Utilities

#### `validateImageFile(file: File)`
Validates file type and size.
```typescript
const validation = validateImageFile(file);
if (!validation.valid) {
  console.error(validation.error);
}
```

#### `uploadImageToLocalStorage(file: File)`
Handles complete upload process.
```typescript
const result = await uploadImageToLocalStorage(file);
if (result.success) {
  console.log(result.imagePath); // Base64 data URL
}
```

#### `createPreviewUrl(file: File)`
Creates object URL for immediate preview.
```typescript
const previewUrl = createPreviewUrl(file);
setPreview(previewUrl);
```

#### `revokePreviewUrl(url: string)`
Cleans up object URL to prevent memory leaks.
```typescript
revokePreviewUrl(previewUrl);
```

## Configuration

Modify `src/config/imageConfig.ts` to customize:
```typescript
export const IMAGE_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,    // Change max file size
  ALLOWED_TYPES: ["image/jpeg", ...], // Add/remove formats
  UPLOAD_DIR: "/uploads/products",    // Change directory
  STORAGE_STRATEGY: "localStorage",   // Change strategy
};
```

## ImageUploadField Component

### Props
```typescript
interface ImageUploadFieldProps {
  value: string;                    // Current image (base64 or URL)
  onChange: (value: string) => void; // Callback on image change
  onFileSelect?: (file: File) => void; // Optional file callback
  label?: string;                   // Field label (default: "Product Image")
  disabled?: boolean;               // Disable upload
}
```

### Usage Example
```tsx
<ImageUploadField
  value={formData.image_url}
  onChange={(value) => setFormData({ ...formData, image_url: value })}
  label="Product Image"
  disabled={isLoading}
/>
```

## Future Enhancements

### 1. Server-Side Storage
Replace localStorage with actual file uploads:
```typescript
// src/lib/imageUpload.ts
export const uploadImageToServer = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('/api/upload', { method: 'POST', body: formData });
  return response.json();
};
```

### 2. IndexedDB for Larger Storage
For more than 100 images:
```typescript
const result = await uploadImageToIndexedDB(file);
// Handles 50MB+ storage
```

### 3. Image Compression
Before upload:
```typescript
const compressedImage = await compressImage(file);
const result = await uploadImageToLocalStorage(compressedImage);
```

### 4. Multiple Images per Product
```typescript
// Add gallery support
gallery: [
  "data:image/jpeg;base64,...",
  "data:image/jpeg;base64,...",
]
```

## Troubleshooting

### Issue: "localStorage quota exceeded"
**Solution**: Clear browser storage or implement IndexedDB

### Issue: Images not persisting
**Solution**: Check if localStorage is enabled and not in private mode

### Issue: Images not displaying
**Solution**: Verify base64 format in database, check browser console for errors

### Issue: Slow upload/display
**Solution**: Implement image compression or server-side storage

## Database Schema

The images are stored in the existing `products` table:
```sql
ALTER TABLE products ADD COLUMN image_url TEXT;
-- image_url contains: 'data:image/jpeg;base64,...' or 'https://...'
```

No schema changes needed - uses existing `image_url` field!

## Migration from URL Images

If you have existing URL-based images:
```typescript
// Keep using URLs - they work alongside base64
const productData = {
  image_url: "https://example.com/image.jpg" // Still works!
};
```

Images can be a mix of:
- URLs: `https://example.com/image.jpg`
- Base64: `data:image/jpeg;base64,...`
- Local paths: `/uploads/products/image.jpg` (if server supports)

## Performance Tips

1. **Lazy load images**: Load images only when visible
2. **Resize before upload**: Compress larger files
3. **Use WebP format**: Smaller file size
4. **Limit to essential images**: Not every product needs local images
5. **Archive old images**: Remove unused images from localStorage

## Security Considerations

1. ✅ File type validation (MIME check)
2. ✅ File size limits (5MB max)
3. ⚠️ Base64 stored client-side (not ideal for sensitive data)
4. ⚠️ No server validation (implement on backend for production)
5. 🔒 Consider server-side storage for production apps

## Testing

```typescript
// Test image upload
const testFile = new File(
  [new ArrayBuffer(1024)],
  "test.jpg",
  { type: "image/jpeg" }
);
const result = await uploadImageToLocalStorage(testFile);
console.assert(result.success, "Upload failed");
```

---

**Version**: 1.0.0  
**Last Updated**: February 2, 2026  
**Status**: ✅ Ready for Production (with server-side implementation)
