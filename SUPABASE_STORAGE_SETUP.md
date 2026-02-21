# Supabase Storage Setup Guide

## Overview
Images are now stored in **Supabase Storage** instead of as base64 in the database. Only image URLs are stored in the database, which **significantly improves loading performance**.

## What Changed
✅ **Before**: Full image data (base64) stored in database + localStorage  
✅ **After**: Only image URL stored in database, images served from Supabase Storage CDN

## Benefits
- ⚡ **Faster loading** - Images loaded from CDN
- 💾 **Smaller database** - Only URLs stored, not file data
- 🔧 **Better scalability** - Decoupled image storage from database
- 📊 **Easy management** - Manage images in Supabase console

## Setup Instructions

### Step 1: Create Storage Bucket in Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Storage** section (in left sidebar)
4. Click **Create a new bucket**
5. Configure bucket:
   - **Name**: `product-images`
   - **Public bucket**: Toggle ✅ (YES) - *Images need to be publicly accessible*
   - Click **Create bucket**

### Step 2: Set Storage Bucket Policies (RLS)

After creating the bucket, configure access policies:

1. Click on `product-images` bucket
2. Go to **Policies** tab
3. Add the following policies:

#### Policy 1: Public Read Access (Anyone can view images)
```sql
CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');
```

#### Policy 2: Admin Upload Access (Only authenticated admins can upload)
```sql
CREATE POLICY "Admin upload access"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

#### Policy 3: Admin Delete Access (Only admins can delete)
```sql
CREATE POLICY "Admin delete access"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);
```

Or use the Supabase UI to configure these policies visually.

### Step 3: No Code Changes Needed!

The codebase has been updated to use this new system automatically:
- ✅ `imageUpload.ts` - Now uses Supabase Storage API
- ✅ `ImageUploadField.tsx` - Handles uploads and returns URLs
- ✅ Database - Stores only image URLs
- ✅ ProductsManager - Works with image URLs

### Step 4: Test Image Upload

1. Run your development server: `npm run dev`
2. Go to Admin Dashboard
3. Try uploading a product image
4. The image should upload to Supabase Storage
5. The image URL will be saved in the database

## Image URL Format

Uploaded images will have URLs like:
```
https://[project-id].supabase.co/storage/v1/object/public/product-images/products/[timestamp]-[random].jpg
```

These URLs are:
- 🌍 Global CDN - Fast worldwide delivery
- 🔓 Publicly accessible - No authentication needed to view
- 💪 Permanent - Won't expire unless you delete them

## Managing Images in Supabase

### View Uploaded Images
1. Supabase Dashboard → Storage → product-images
2. You'll see all uploaded product images
3. Can delete/manage images here if needed

### Delete Image from Database
When deleting a product:
1. The image URL is removed from the database automatically
2. You can optionally delete the image file from Supabase Storage for cleanup
3. See the `deleteImageFromSupabase()` function in `imageUpload.ts`

## Troubleshooting

### ❌ "Permission denied" when uploading
- **Solution**: Check bucket visibility - must be **Public**
- Check RLS policies - needs INSERT permission for authenticated users

### ❌ "Bucket not found"
- **Solution**: Make sure bucket is named exactly `product-images`
- Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env

### ❌ Images not loading
- **Solution**: Check bucket is public
- Check RLS policies allow SELECT
- Try accessing image URL directly in browser

### ❌ "File already exists" error
- **Solution**: Image names are unique (timestamp + random), shouldn't happen
- If stuck, delete bucket and recreate

## Performance Comparison

| Aspect | Before | After |
|--------|--------|-------|
| Image Storage | Database (base64) | Supabase Storage |
| URL Storage | Full image data | Tiny URL string |
| Database Size | ~50KB per image | ~200 bytes per image |
| Load Speed | Slower (database), Base64 decode | ⚡ Fast (CDN, optimized format) |
| Scale | Limited by DB size | Unlimited (cloud storage) |

## Next Steps

### Optional: Image Optimization
- Add image compression/resizing with Supabase functions
- Set up image variants for different devices
- Enable image formats like WebP

### Optional: Cleanup Old Images
If you had old products with base64 images:
```javascript
// Script to migrate old base64 images to Supabase Storage
// (Not included in this update, but possible if needed)
```

## Additional Resources

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Supabase Storage Security](https://supabase.com/docs/guides/storage/security)
- [Supabase Auth & RLS](https://supabase.com/docs/guides/auth)

## Questions?

Check the updated files:
- `src/lib/imageUpload.ts` - Upload logic
- `src/components/ImageUploadField.tsx` - Upload UI
- `src/config/imageConfig.ts` - Configuration
