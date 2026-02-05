# Testing & Validation Guide

## 🧪 Feature Testing Checklist

### Product Card - Color/Finish Selection
- [ ] Click on different finish buttons
  - [ ] Image indicator badge updates
  - [ ] Color dot appears with finish name
  - [ ] Selected button shows blue border
  - [ ] All finishes are clickable
- [ ] Arrow buttons (if multiple finishes)
  - [ ] Left arrow goes to previous finish
  - [ ] Right arrow goes to next finish
  - [ ] Image counter updates (1/8, 2/8)
  - [ ] Arrows only visible on hover (desktop)

### Product Card - Size Selection
- [ ] Click on different size buttons
  - [ ] Price updates dynamically
  - [ ] Base price shown in smaller text (if available)
  - [ ] Selected button shows blue border
  - [ ] All sizes are clickable
- [ ] Price Calculation
  - [ ] Base: ₹200, Small (1st): ₹200 ✓
  - [ ] Base: ₹200, Medium (2nd): ₹230 ✓
  - [ ] Base: ₹200, Large (3rd): ₹260 ✓

### Responsive Design
#### Mobile (< 640px)
- [ ] Single column product grid
- [ ] Large touch-friendly buttons
- [ ] Proper text sizing (readable)
- [ ] Finish buttons wrap properly
- [ ] Size buttons wrap properly
- [ ] WhatsApp button full width
- [ ] No horizontal scroll

#### Tablet (640-1024px)
- [ ] Two column product grid
- [ ] Good spacing between items
- [ ] Images are large enough
- [ ] Buttons are touch-friendly
- [ ] Text is readable

#### Desktop (1024px+)
- [ ] Three+ columns visible
- [ ] Hover effects work smoothly
- [ ] Arrow buttons appear on hover
- [ ] All interactive elements visible
- [ ] Professional spacing

### Navbar & Logo
- [ ] Logo appears larger (h-16 on mobile, h-20 on desktop)
- [ ] Logo is centered vertically
- [ ] Navbar height increased accordingly
- [ ] Logo has hover effect (slight scale)
- [ ] Navigation links aligned properly
- [ ] WhatsApp button visible and accessible

### Categories Section
- [ ] Four category cards visible
- [ ] Icons are larger and colorful
- [ ] Text is readable and properly sized
- [ ] Hover effects work smoothly
- [ ] Arrow animation on hover
- [ ] Mobile shows 1 column
- [ ] Tablet shows 2 columns
- [ ] Desktop shows 4 columns

### Admin Dashboard - Categories Manager
- [ ] "New Category" button is visible
- [ ] Click opens dialog form
- [ ] Form has three fields:
  - [ ] Category ID (slug format)
  - [ ] Category Name
  - [ ] Description
- [ ] Create new category:
  - [ ] Fill all fields
  - [ ] Click "Create Category"
  - [ ] Success toast appears
  - [ ] New category appears in list
- [ ] Edit existing category:
  - [ ] Click edit icon
  - [ ] Form opens with current data
  - [ ] Can change Name & Description
  - [ ] ID field is disabled (read-only)
  - [ ] Click "Update Category"
  - [ ] Success toast appears
- [ ] Delete category:
  - [ ] Click delete icon
  - [ ] Confirmation dialog appears
  - [ ] Click "OK" to confirm
  - [ ] Category disappears
  - [ ] Success toast appears
- [ ] Validation:
  - [ ] Cannot create empty fields
  - [ ] Cannot create duplicate IDs
  - [ ] Shows error messages

---

## 🔍 Browser Compatibility Testing

Test on:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Known Good Platforms
- ✅ Chrome 120+
- ✅ Firefox 121+
- ✅ Safari 17+
- ✅ Edge 120+

---

## 📐 Layout Verification

### Product Card Heights
- All cards in same row should have equal height
- Content should be vertically distributed
- WhatsApp button should stay at bottom

### Grid Alignment
- No misalignment between columns
- Equal gaps between items
- Responsive gaps (smaller on mobile)

### Font Sizing
```
Mobile:
- Product name: text-sm
- Price: text-lg
- Category: text-xs
- Description: text-xs

Desktop:
- Product name: text-base
- Price: text-xl
- Category: text-xs
- Description: text-sm
```

---

## ⚠️ Common Issues & Solutions

### Issue: Colors Not Showing
**Solution**: Check finish name in data matches colorMap in ProductCard.tsx
```tsx
// Add missing finish to colorMap:
"MyFinish": "bg-custom-color-500",
```

### Issue: Price Not Updating
**Solution**: Ensure product has sizes array
```tsx
{
  sizes: ["Small", "Medium", "Large"], // Must be present
  price: 200
}
```

### Issue: Images Not Changing
**Solution**: Verify image_url is populated in database
```tsx
// Should have valid image URL:
image_url: "https://example.com/image.jpg"
```

### Issue: Mobile Layout Broken
**Solution**: Clear browser cache and rebuild
```bash
# Clear cache and rebuild
npm run build
# or
bun run build
```

### Issue: Navbar Too Large
**Solution**: Check tailwind is properly compiled
- If logo appears too small: Check CSS was built
- If navbar has wrong height: Restart dev server

### Issue: Categories Not Appearing
**Solution**: Ensure CategoriesManager is imported in AdminDashboard
```tsx
import { CategoriesManager } from "./CategoriesManager";
```

---

## 🎬 Performance Testing

### Page Load Time
- [ ] Product grid loads in < 2 seconds
- [ ] Images load without jarring
- [ ] No layout shift when colors/sizes update
- [ ] Smooth scrolling on mobile

### Interaction Speed
- [ ] Color click response: < 100ms
- [ ] Size click response: < 100ms
- [ ] Image hover effect: smooth (60fps)
- [ ] Category hover: smooth animation

### Mobile Performance
- [ ] No jank when scrolling
- [ ] Touch targets are 44x44px minimum
- [ ] No lag when switching tabs (Admin)

---

## 📸 Visual Regression Testing

### Before & After Comparison

#### Product Card
- [ ] Image area is taller (aspect-square)
- [ ] Color indicator badge visible
- [ ] Pricing is larger and centered
- [ ] Buttons are better spaced
- [ ] WhatsApp button is prominent

#### Navbar
- [ ] Logo is noticeably larger
- [ ] More breathing room in navbar
- [ ] All navigation items aligned

#### Categories
- [ ] Icons are bigger and colorful
- [ ] Better visual hierarchy
- [ ] More prominent on mobile

---

## 🐛 Bug Report Template

Found an issue? Use this template:

```
**Issue Title**: [Specific, concise description]

**Environment**:
- Browser: [Chrome/Firefox/Safari] v[version]
- Device: [Desktop/Tablet/Mobile]
- URL: [page where issue occurs]

**Steps to Reproduce**:
1. Go to...
2. Click on...
3. Observe...

**Expected**:
[What should happen]

**Actual**:
[What actually happened]

**Screenshots**:
[Attach if possible]

**Severity**:
[ ] Critical (doesn't work)
[ ] High (looks broken)
[ ] Medium (works but suboptimal)
[ ] Low (minor visual issue)
```

---

## ✅ Acceptance Criteria

Product Component is READY when:

1. ✅ Colors/finishes update image dynamically
2. ✅ Size selection updates price dynamically
3. ✅ All responsive breakpoints work correctly
4. ✅ Navbar logo is larger and prominent
5. ✅ Categories can be created by admins
6. ✅ Grid alignment is perfect on all devices
7. ✅ No console errors
8. ✅ All hover effects are smooth
9. ✅ Touch targets are large enough
10. ✅ Text is readable on all devices

---

## 🚀 Deployment Checklist

Before going live:

- [ ] All tests pass locally
- [ ] No console errors in production build
- [ ] Images are optimized (not too large)
- [ ] Navbar logo displays correctly
- [ ] Product cards responsive on all devices
- [ ] Admin categories manager works
- [ ] WhatsApp links include correct information
- [ ] Database has all necessary fields
- [ ] CSS is properly compiled
- [ ] No hardcoded paths or localhost URLs

---

## 📞 Support

For issues or questions:
1. Check PRODUCT_COMPONENT_GUIDE.md
2. Review FEATURE_SUMMARY.md
3. Check console for error messages
4. Use browser DevTools to inspect elements
