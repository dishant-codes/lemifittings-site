# Visual Component Reference

## Product Card - Interactive Element Locations

```
┌─────────────────────────────────────────────┐
│  NEW  │  ❤️ 👁️                              │  ← Badges & Quick Actions
├─────────────────────────────────────────────┤
│                                             │
│  ◄─────  PRODUCT IMAGE  ─────►              │  ← Image with Carousel
│         (1/8) counter                       │  ← Arrow buttons on hover
│      [⭕ Gold] ← Color indicator badge     │  ← Color dot + finish name
│                                             │
│                 [Enquire] ← Appears on hover│
│                 WhatsApp                    │
│                                             │
├─────────────────────────────────────────────┤
│  WOODEN COLLECTION                          │  ← Category
│  BT-3004 Wooden Handle        ₹230/pc      │  ← Name + Price (dynamic!)
│  Base Price: ₹200                          │  ← Shows if size-based pricing
│  Premium door handle...                     │  ← Description
│                                             │
│  Finish ◄─────────────────► 5/8            │  ← Label + Counter
│  [Black] [Gold] [Matt] [CP] [AB] [+3]     │  ← Finish buttons
│                                             │
│  Size                                       │  ← Size selector
│  [4"] [6"] [8"] [10"]                      │  ← Size options
│                                             │
│  📦 Packaging: 2 pcs/box                    │  ← Packaging info
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ 💬 Enquire on WhatsApp               │  │  ← Always visible
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## Responsive Grid Layout

```
MOBILE (< 640px)
┌────────────────────────┐
│     Product Card       │
├────────────────────────┤
│     Product Card       │
├────────────────────────┤
│     Product Card       │
└────────────────────────┘
(1 Column)


TABLET (640px - 1024px)
┌──────────────────┬──────────────────┐
│  Product Card    │  Product Card     │
├──────────────────┼──────────────────┤
│  Product Card    │  Product Card     │
└──────────────────┴──────────────────┘
(2 Columns)


DESKTOP (1024px - 1280px)
┌─────────────┬─────────────┬─────────────┐
│   Card      │   Card      │   Card      │
├─────────────┼─────────────┼─────────────┤
│   Card      │   Card      │   Card      │
└─────────────┴─────────────┴─────────────┘
(3 Columns)


LARGE (1280px - 1536px)
┌──────────┬──────────┬──────────┬──────────┐
│  Card    │  Card    │  Card    │  Card    │
└──────────┴──────────┴──────────┴──────────┘
(4 Columns)


EXTRA LARGE (> 1536px)
┌────────┬────────┬────────┬────────┬────────┐
│ Card   │ Card   │ Card   │ Card   │ Card   │
└────────┴────────┴────────┴────────┴────────┘
(5 Columns)
```

---

## Navbar Structure (After Improvement)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  🏢 [LEMI LOGO]     Home  Products  Categories    📞  💬      │
│   ↑ Now LARGER!                                   Call  Chat   │
│   h-16 (mobile)                                                │
│   h-20 (desktop)                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Category Card - Enhanced

```
┌─────────────────────────────────────────┐
│                                         │
│      ◎◎◎◎ ICON ◎◎◎◎  ← Larger now    │
│    (w-20 h-20 mobile)                  │
│    (w-24 h-24 desktop)                 │
│                                         │
│  ✨ Knobs ✨     ← Bold font           │
│  Premium cabinet...  ← Better spacing  │
│                                         │
│  Browse →  ← Appears on hover         │
│                                         │
└─────────────────────────────────────────┘
```

---

## Dynamic Pricing Example

```
SCENARIO 1: No Size Options
├─ Product: BT-714 Knob
├─ Finishes: SS, AB, Black
├─ No sizes defined
└─ Price: Always ₹190/pc (fixed)

SCENARIO 2: With Size Options
├─ Product: Chocolate Knob
├─ Finishes: CP, Matt, Gold, AB, RG, Graphite (6 options)
├─ Sizes: [Small, Medium, Large]
└─ Pricing:
   ├─ Base Price: ₹460/pc
   ├─ If "Small" (0): ₹460 × 1.00 = ₹460/pc
   ├─ If "Medium" (1): ₹460 × 1.15 = ₹529/pc
   └─ If "Large" (2): ₹460 × 1.30 = ₹598/pc

SCENARIO 3: Multiple Size Options
├─ Sizes: [12mm, 16mm, 19mm, 22mm, 25mm, 32mm]
├─ Base: ₹100/pc
└─ Pricing:
   ├─ 12mm (0): ₹100 × 1.00 = ₹100/pc
   ├─ 16mm (1): ₹100 × 1.15 = ₹115/pc
   ├─ 19mm (2): ₹100 × 1.30 = ₹130/pc
   ├─ 22mm (3): ₹100 × 1.45 = ₹145/pc
   ├─ 25mm (4): ₹100 × 1.60 = ₹160/pc
   └─ 32mm (5): ₹100 × 1.75 = ₹175/pc
```

---

## Color Finish Indicators

```
METALLIC FINISHES
├─ SS (Stainless Steel) → ⚫ Silver
├─ CP (Chrome Plated) → ⚫ Chrome Gray
├─ Matt → ⚫ Dark Gray
├─ Gold → ⚫ Gold Yellow
├─ Black → ⚫ Black
├─ RG (Rose Gold) → ⚫ Rose Pink
├─ Graphite → ⚫ Dark Gray
└─ AB (Antique Brass) → ⚫ Amber Brown

CRYSTAL FINISHES
├─ Red → ⚫ Bright Red
├─ Blue → ⚫ Bright Blue
├─ Pink → ⚫ Light Pink
├─ Yellow → ⚫ Bright Yellow
├─ Green → ⚫ Leaf Green
├─ Clear → ⚫ Cyan/Light (border)
└─ Rainbow → ⚫ Multi-gradient

WOOD FINISHES
├─ Rosewood → ⚫ Dark Red
└─ Steambeach → ⚫ Dark Brown
```

---

## Admin Dashboard - Categories Manager

```
CATEGORIES MANAGER
┌──────────────────────────────────────────┐
│ Manage Categories        [+ New Category] │
├──────────────────────────────────────────┤
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ Knobs                      [✏️ 🗑️]  │ │
│ │ ID: knobs                            │ │
│ │ Premium cabinet and furniture...     │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ Handles                    [✏️ 🗑️]  │ │
│ │ ID: handles                          │ │
│ │ Quality handles for all...           │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ Key Holes                  [✏️ 🗑️]  │ │
│ │ ID: keyholes                         │ │
│ │ Decorative keyholes and...           │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ Accessories                [✏️ 🗑️]  │ │
│ │ ID: accessories                      │ │
│ │ Hardware accessories and...          │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ 💡 Categories created here will appear   │
│    in the product creation form          │
└──────────────────────────────────────────┘
```

### Create/Edit Dialog

```
┌────────────────────────────────────────────┐
│ Create New Category              [X]       │
├────────────────────────────────────────────┤
│                                            │
│ Category ID (slug)                         │
│ [wooden-handles________________]           │
│ ⓘ Unique identifier (cannot be changed)   │
│                                            │
│ Category Name                              │
│ [Wooden Handles________________]           │
│                                            │
│ Description                                │
│ [Premium wooden handles for doors]         │
│ [and cabinets. Elegant design.]           │
│ [Beautiful finish.________________]        │
│                                            │
│              [Cancel] [Create Category]   │
└────────────────────────────────────────────┘
```

---

## User Interaction Flow

```
START: User lands on products page
   ↓
STEP 1: Sees product grid
        ├─ Desktop: 3+ columns
        ├─ Tablet: 2 columns
        └─ Mobile: 1 column
   ↓
STEP 2: User hovers/taps product
        └─ WhatsApp button appears (desktop)
   ↓
STEP 3: User selects a FINISH (color)
        ├─ Color dot indicator updates
        ├─ Card highlights "Gold" button
        └─ Color badge appears on image
   ↓
STEP 4: User selects a SIZE
        ├─ Price updates dynamically
        ├─ "Large" button is highlighted
        └─ Base price shown if multi-size
   ↓
STEP 5: User clicks "Enquire on WhatsApp"
        ├─ Pre-filled message:
        │  "Hi! I'm interested in BT-3004 
        │   Wooden Handle (Gold, Size: 6") 
        │   - ₹230/pc. Please share details"
        ├─ WhatsApp web/app opens
        └─ Message ready to send
   ↓
END: Admin responds with quotation
```

---

## Touch Target Sizes

```
MINIMUM TOUCH TARGET (Mobile)
┌──────────────────┐
│                  │  44x44 pixels minimum
│    [Button]      │  (Apple guidelines)
│                  │
└──────────────────┘

ACTUAL SIZES IN DESIGN
├─ Product cards: Full width - good ✓
├─ Finish buttons: 32px height - good ✓
├─ Size buttons: 40px height - good ✓
├─ WhatsApp button: Full width, 44px - good ✓
└─ Navigation links: 40px height - good ✓
```

---

## Database Schema (Categories)

```
categories table
├─ id (string, primary key)
│  └─ Example: "wooden-handles"
├─ name (string)
│  └─ Example: "Wooden Handles"
├─ description (string)
│  └─ Example: "Premium wooden handles..."
├─ created_at (timestamp)
├─ updated_at (timestamp)
└─ (optional) image_url, display_order, etc.

products table
├─ id
├─ name
├─ category (foreign key → categories.id)
├─ price
├─ finishes (array/json)
├─ sizes (array/json or null)
├─ image_url
└─ ... other fields
```

---

## Performance Metrics

```
EXPECTED LOAD TIMES
├─ Page load: < 2 seconds
├─ Product grid render: < 500ms
├─ Color click response: < 100ms
├─ Size click response: < 100ms
├─ Hover effect: 60fps (smooth)
└─ Mobile scroll: 60fps (smooth)

BUNDLE SIZE
├─ ProductCard component: ~15KB
├─ ProductsSection: ~12KB
├─ CategoriesManager: ~18KB
└─ Total CSS (Tailwind): ~35KB (minified)
```

---

This visual reference should help you understand exactly how everything looks and functions!
