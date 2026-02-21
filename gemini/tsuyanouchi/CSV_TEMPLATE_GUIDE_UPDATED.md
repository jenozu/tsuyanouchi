# 📝 CSV Template Guide - Individual Size Pricing

## 🎯 NEW FORMAT: Individual Prices Per Size

Your CSV now supports **individual prices and costs for each size variation**!

---

## 📋 Template Files

1. **`csv-template-blank.csv`** - Empty template with all columns
2. **`csv-template-with-example.csv`** - Template with pricing example

---

## 📊 CSV Column Structure

### Required Base Columns

| Column | Type | Example | Notes |
|--------|------|---------|-------|
| **name** | Text | `"Mountain Landscape"` | Product name |
| **category** | Text | `"Art Prints"` | Category for filtering |
| **stock** | Number | `50` | Total quantity |
| **imageUrl** | Text | `"mountain.jpg"` | Filename only |

### Optional Base Columns

| Column | Type | Example | Notes |
|--------|------|---------|-------|
| **description** | Text | `"Beautiful print"` | Product description |
| **videoUrl** | Text | `"https://..."` | Video URL for hover |

### Size-Specific Price Columns (At Least One Required)

| Size | Price Column | Cost Column |
|------|--------------|-------------|
| 8" x 10" | `price_8x10` | `cost_8x10` |
| 11" x 14" | `price_11x14` | `cost_11x14` |
| 12" x 18" | `price_12x18` | `cost_12x18` |
| 16" x 20" | `price_16x20` | `cost_16x20` |
| 18" x 24" | `price_18x24` | `cost_18x24` |
| 20" x 30" | `price_20x30` | `cost_20x30` |
| 24" x 32" | `price_24x32` | `cost_24x32` |
| 24" x 36" | `price_24x36` | `cost_24x36` |

---

## ✍️ Complete Example

```csv
name,category,stock,imageUrl,description,videoUrl,price_8x10,cost_8x10,price_11x14,cost_11x14,price_12x18,cost_12x18,price_16x20,cost_16x20,price_18x24,cost_18x24,price_20x30,cost_20x30,price_24x32,cost_24x32,price_24x36,cost_24x36
"Mountain Landscape","Art Prints",50,"mountain.jpg","Stunning mountain view","",189,85,229,105,259,115,289,125,329,145,369,165,409,185,449,205
"Ocean Waves","Art Prints",45,"ocean.jpg","Dramatic ocean scene","",189,85,229,105,259,115,289,125,329,145,369,165,409,185,449,205
"Forest Path","Art Prints",40,"forest.jpg","Peaceful forest","",189,85,229,105,259,115,289,125,329,145,369,165,409,185,449,205
```

---

## 🎯 Pricing Flexibility

### Option 1: All Sizes (Recommended)
Provide prices for all 8 sizes:
```csv
name,category,stock,imageUrl,...,price_8x10,cost_8x10,price_11x14,cost_11x14,...
"Product","Art Prints",50,"image.jpg","",189,85,229,105,...
```

### Option 2: Some Sizes
Only provide prices for sizes you want to sell:
```csv
name,category,stock,imageUrl,...,price_8x10,cost_8x10,price_11x14,cost_11x14,price_12x18,cost_12x18,...
"Product","Art Prints",50,"image.jpg","",189,85,229,105,259,115,0,0,0,0,0,0,0,0,0,0
```
*Leave unwanted sizes as 0 or empty*

### Option 3: Different Pricing Per Product
Each product can have its own pricing structure:
```csv
"Budget Print","Posters",100,"budget.jpg","",99,45,129,55,149,65,0,0,0,0,0,0,0,0,0,0
"Premium Print","Art Prints",20,"premium.jpg","",229,105,279,125,329,145,389,165,449,185,509,205,579,225,649,245
```

---

## 💡 Suggested Pricing Examples

### Example 1: Standard Print Pricing
```
8" x 10"  → $189 (cost: $85)
11" x 14" → $229 (cost: $105)
12" x 18" → $259 (cost: $115)
16" x 20" → $289 (cost: $125)
18" x 24" → $329 (cost: $145)
20" x 30" → $369 (cost: $165)
24" x 32" → $409 (cost: $185)
24" x 36" → $449 (cost: $205)
```

### Example 2: Budget Pricing (Fewer Sizes)
```
8" x 10"  → $99 (cost: $45)
11" x 14" → $129 (cost: $55)
12" x 18" → $149 (cost: $65)
Others → Not offered (set to 0)
```

### Example 3: Premium Pricing
```
8" x 10"  → $229
11" x 14" → $279
12" x 18" → $329
16" x 20" → $389
18" x 24" → $449
20" x 30" → $509
24" x 32" → $579
24" x 36" → $649
```

---

## 📝 How to Fill Out in Excel

### Step 1: Open Template
Open `csv-template-blank.csv` in Excel

### Step 2: Fill Basic Info
- Column A: Product name (with quotes)
- Column B: Category (with quotes)
- Column C: Stock (number, no quotes)
- Column D: Image filename (with quotes)
- Column E: Description (with quotes, optional)
- Column F: Video URL (with quotes, optional)

### Step 3: Fill Size Prices
- Columns G-V: Price and cost for each size
- Enter numbers only (no $ sign, no quotes)
- Leave blank or 0 for sizes you don't offer

### Step 4: Save
- File → Save As → CSV (Comma delimited)
- Name it: `my-products.csv`

---

## ✅ Important Rules

### 1. Text Needs Quotes
```csv
✅ "Mountain Print","Art Prints"
❌ Mountain Print,Art Prints
```

### 2. Numbers Don't Need Quotes
```csv
✅ 50,189,85,229,105
❌ "50","189","85"
```

### 3. At Least One Size Price Required
```csv
✅ ...,189,85,0,0,0,0...  (at least one price filled)
❌ ...,0,0,0,0,0,0,0,0...  (all zeros - invalid!)
```

### 4. Cost is Optional
```csv
✅ ...,price_8x10,cost_8x10,...
    ...,189,0,...           (cost can be 0)
```

### 5. Image URL - Just Filename!
```csv
✅ "mountain.jpg"
❌ "1/mountain.jpg"
```

---

## 🎨 Real-World Example

**Scenario:** You sell art prints in 3 standard sizes and 2 premium sizes.

**CSV:**
```csv
name,category,stock,imageUrl,description,videoUrl,price_8x10,cost_8x10,price_11x14,cost_11x14,price_12x18,cost_12x18,price_16x20,cost_16x20,price_18x24,cost_18x24,price_20x30,cost_20x30,price_24x32,cost_24x32,price_24x36,cost_24x36
"Mountain Vista","Art Prints",50,"mountain.jpg","Majestic mountain landscape","",189,85,229,105,259,115,0,0,0,0,0,0,0,0,0,0
"Ocean Sunset Premium","Art Prints",20,"ocean.jpg","Premium ocean print","",0,0,0,0,0,0,389,165,449,185,0,0,0,0,0,0
"Forest Collection","Art Prints",100,"forest.jpg","Standard forest prints","",189,85,229,105,259,115,289,125,329,145,0,0,0,0,0,0
```

**Result:**
- Mountain Vista: Only 3 sizes offered (8x10, 11x14, 12x18)
- Ocean Sunset: Only 2 premium sizes (16x20, 18x24)
- Forest Collection: 5 sizes offered (8x10 through 18x24)

---

## 🐛 Common Mistakes

### ❌ Mistake 1: No Size Prices
```csv
"Product","Category",50,"image.jpg","",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
```
**Error:** At least one size price must be provided

**Fix:** Add at least one price
```csv
"Product","Category",50,"image.jpg","",189,85,0,0,0,0,0,0,0,0,0,0,0,0,0,0
```

### ❌ Mistake 2: Wrong Column Names
```csv
name,category,stock,imageUrl,8x10_price,8x10_cost,...
```
**Error:** Column names must be exactly: `price_8x10`, `cost_8x10`

### ❌ Mistake 3: Text in Price Columns
```csv
...,price_8x10,cost_8x10,...
...,"$189","$85",...
```
**Fix:** Numbers only, no $ signs
```csv
...,189,85,...
```

---

## 🚀 Import Process

1. **Fill out CSV template** with your pricing
2. **Save as `.csv` file**
3. **Upload images** to Supabase: `npm run upload-images-1`
4. **Start dev server:** `npm run dev`
5. **Login to admin:** http://localhost:3000/admin/login
6. **Import CSV:** Collection → IMPORT CSV
7. **Done!** ✨

---

## 💡 Pro Tips

### Tip 1: Use Excel Formulas
Calculate pricing tiers automatically:
```
=ROUND(B2*1.2,0)  // 20% markup from cost
```

### Tip 2: Copy Down Pricing
If all products have same pricing structure:
1. Fill pricing for first product
2. Copy cells down for other products

### Tip 3: Batch Edit Pricing
To update all products' pricing:
1. Open CSV in Excel
2. Find & Replace to update prices
3. Save and re-import

### Tip 4: Test with One Product First
- Create CSV with just 1 product
- Import and verify pricing looks correct
- Then import full catalog

---

## ✅ Validation Checklist

Before importing:
- [ ] Required columns filled: name, category, stock, imageUrl
- [ ] At least one size price provided per product
- [ ] Text values have quotes: `"text"`
- [ ] Numbers don't have quotes: `123`
- [ ] Image filenames match uploaded files exactly
- [ ] No $ signs in price columns
- [ ] File saved as `.csv` format

---

## 📚 Quick Reference

**New Format:**
```csv
name,category,stock,imageUrl,description,videoUrl,price_8x10,cost_8x10,price_11x14,cost_11x14,...
"Product","Category",50,"image.jpg","Description","",189,85,229,105,...
```

**Old Format (No Longer Supported):**
```csv
name,category,price,stock,imageUrl,description,cost,videoUrl
"Product","Category",189,50,"image.jpg","Description",85,""
```

---

**Ready to create your CSV!** Open `csv-template-blank.csv` and start filling in your pricing! 🎉
