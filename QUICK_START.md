# Image Upload - Quick Start Guide

## ✨ What You Get

1. **Upload Images from Admin Dashboard** - Simple drag-and-drop interface
2. **Local Storage** - Images stored in browser's localStorage (no server needed initially)
3. **Automatic Preview** - See images immediately after upload
4. **Storage Monitoring** - Track how much storage is used
5. **Fetch on Website** - Images display automatically on product pages

## 🚀 How to Use

### Step 1: Admin Dashboard - Upload Image

```
1. Go to Admin Dashboard → Products
2. Click "Add Product" or edit existing product
3. Scroll to "Product Image" section
4. Click the upload area or drag an image file
5. Image preview appears
6. Complete the form and save
```

### Step 2: View on Website

Images automatically display on:
- Product cards
- Product details page
- Search results
- Category pages

## 📋 Features

### Image Upload Field Component

```tsx
<ImageUploadField
  value={imageBase64}
  onChange={(newImage) => setImage(newImage)}
  label="Product Image"
  disabled={isLoading}
/>
```

**Capabilities:**
- ✅ Drag & drop upload
- ✅ Click to browse files
- ✅ File validation (type & size)
- ✅ Instant preview
- ✅ Remove/replace image
- ✅ URL fallback option

### Storage Features

```tsx
// Use the hook to manage images
const { 
  storageUsage, 
  imageCount, 
  storeImage, 
  getImage,
  deleteImage,
  clearAllImages,
  formatStorageSize 
} = useLocalImageStorage();
```

### Admin Dashboard Stats

Storage widget shows:
- 📊 Used storage (in MB/KB)
- 📈 Storage percentage
- 🖼️ Total images stored
- ⚠️ Low storage warning
- 🗑️ Clear all button

## 💾 How Images Are Stored

### Current Approach: Browser LocalStorage

```
User uploads image
    ↓
Validate (type & size)
    ↓
Convert to Base64
    ↓
Store in localStorage
    ↓
Save path to database
    ↓
Display on website using data URL
```

**Pros:**
- No backend server needed
- Fast for prototyping
- Data persists across sessions
- Works offline

**Cons:**
- Limited storage (5-10MB per domain)
- All data in single domain
- Slower with many images
- Can't scale to production

### Limitations

| Aspect | Limit |
|--------|-------|
| Max file size | 5MB per image |
| Total storage | ~5-10MB per domain |
| Estimated images | 50-100 high-quality images |
| Formats | JPEG, PNG, WebP, GIF |

## 🔄 Workflow Example

### Adding a Product with Image

```typescript
// 1. Admin uploads image in ProductsManager form
const [formData, setFormData] = useState({
  name: "Premium Knob",
  image_url: "", // Will be filled by upload
  // ... other fields
});

// 2. ImageUploadField handles the upload
<ImageUploadField
  value={formData.image_url}
  onChange={(value) => setFormData({ ...formData, image_url: value })}
/>
// Returns: "data:image/jpeg;base64,/9j/4AAQ..."

// 3. Submit product with base64 image
const productData = {
  name: "Premium Knob",
  image_url: "data:image/jpeg;base64,/9j/4AAQ...",
  // ... other fields
};

// 4. Save to Supabase
await supabase.from("products").insert(productData);

// 5. Fetch on website
const { data: products } = await supabase.from("products").select("*");

// 6. Display image (base64 works directly in <img>)
<img src={product.image_url} alt={product.name} />
```

## 🛠️ Technical Details

### File Structure

```
src/
├── lib/
│   ├── imageUpload.ts          # Core upload logic
│   └── utils.ts                # General utilities
├── config/
│   └── imageConfig.ts          # Configuration
├── components/
│   ├── ImageUploadField.tsx     # Reusable component
│   └── admin/
│       ├── ProductsManager.tsx  # Uses ImageUploadField
│       └── ImageStorageStats.tsx # Storage monitor
├── hooks/
│   └── useLocalImageStorage.ts  # Image management hook
└── ...
```

### Data Flow

```
ProductsManager
    ↓
  ImageUploadField
    ↓
  imageUpload.ts (validation & conversion)
    ↓
  localStorage (browser storage)
    ↓
  Supabase (base64 in image_url field)
    ↓
  Website Components
    ↓
  <img src={base64} />
```

## 📱 Component Examples

### Using ImageUploadField in Forms

```tsx
import { ImageUploadField } from "@/components/ImageUploadField";

export function ProductForm() {
  const [image, setImage] = useState("");

  return (
    <form>
      <ImageUploadField
        value={image}
        onChange={setImage}
        label="Upload Product Image"
      />
      {/* Submit form with image */}
    </form>
  );
}
```

### Using in Product Display

```tsx
import { Product } from "@/types/database";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      {/* Image displays as-is, whether URL or base64 */}
      <img 
        src={product.image_url} 
        alt={product.name}
        className="w-full h-64 object-cover"
      />
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
    </div>
  );
}
```

### Checking Storage Usage

```tsx
import { useLocalImageStorage } from "@/hooks/useLocalImageStorage";

export function StorageMonitor() {
  const { storageUsage, imageCount, formatStorageSize } = useLocalImageStorage();

  return (
    <div>
      <p>Images: {imageCount}</p>
      <p>Storage: {formatStorageSize(storageUsage)}</p>
    </div>
  );
}
```

## 🚀 Next Steps (Production)

### Option 1: Simple File Server
```typescript
// Create public/uploads folder
// Add images manually or via API
const imagePath = "/uploads/products/product-123.jpg";
```

### Option 2: Backend API Upload
```typescript
export const uploadImageToServer = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  return response.json(); // Returns: { imagePath: '/uploads/...' }
};
```

### Option 3: Cloud Storage (Recommended)
```typescript
// Use Supabase Storage, AWS S3, Cloudinary, etc.
const { data, error } = await supabase.storage
  .from('product-images')
  .upload(`products/${filename}`, file);
```

## 🐛 Troubleshooting

### Images not saving?
- Check localStorage quota
- Try private/incognito mode
- Clear browser cache
- Check file size (<5MB)

### Images not displaying?
- Verify base64 format
- Check browser console for errors
- Ensure product has image_url set
- Test with direct URL first

### Storage full?
- Clear unused images
- Compress before upload
- Use server-side storage
- Implement IndexedDB

## 📚 Resources

- [localStorage MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [FileReader API](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
- [Base64 Images](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)

## ✅ Checklist

- [x] ImageUploadField component created
- [x] imageUpload.ts utilities created
- [x] LocalStorage integration done
- [x] Admin dashboard updated
- [x] Storage monitoring added
- [x] Configuration centralized
- [x] Hook for storage management created
- [ ] Server-side upload (for production)
- [ ] Image compression (optional)
- [ ] CDN integration (optional)

---

**Status:** ✅ Ready to Use  
**Next Version:** Server-side upload support
