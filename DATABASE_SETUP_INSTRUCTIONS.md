# Database Setup Instructions for Supabase

## Choose Your Scenario:

### Scenario 1: Fresh Database (Starting from Scratch)

Use this file: **`SUPABASE_SCHEMA_UPDATED.sql`**

**Steps:**
1. Go to your Supabase Dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the entire contents of `SUPABASE_SCHEMA_UPDATED.sql`
5. Click "Run" (or press Ctrl/Cmd + Enter)
6. Wait for success message

**What this creates:**
- Products table with `product_type` column
- Orders table
- Shipping rates table
- Favorites table
- All necessary indexes
- Default shipping rates
- Sample products (including one with variations)
- Row Level Security policies
- Auto-update triggers

---

### Scenario 2: Existing Database (Already Have Tables)

Use this file: **`MIGRATION_ADD_PRODUCT_TYPE.sql`**

**Steps:**
1. Go to your Supabase Dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the entire contents of `MIGRATION_ADD_PRODUCT_TYPE.sql`
5. Click "Run" (or press Ctrl/Cmd + Enter)
6. Wait for success message

**What this does:**
- Adds `product_type` column to existing products table
- Updates documentation comments
- Does NOT create new tables or modify existing data

---

## Important: Storage Bucket Setup

After running your SQL script, you need to create a storage bucket:

1. In Supabase Dashboard, go to "Storage" in left sidebar
2. Click "Create a new bucket"
3. Name it: `product-images`
4. Make it **Public**
5. Click "Create bucket"

**Why?** This is where product images uploaded through the admin panel are stored.

---

## Verify Setup

After running the SQL:

1. Go to "Table Editor" in Supabase
2. Check the `products` table
3. Verify these columns exist:
   - `id` (UUID)
   - `name` (text)
   - `description` (text)
   - `price` (numeric)
   - `cost` (numeric)
   - `category` (text)
   - `product_type` (text) ← **Must have this**
   - `image_url` (text)
   - `stock` (integer)
   - `sizes` (jsonb) ← **Stores variations**
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

---

## Variations Data Structure

The `sizes` column stores variations as JSONB:

```json
[
  {
    "label": "8\" × 10\"",
    "price": 189,
    "cost": 85
  },
  {
    "label": "11\" × 14\"",
    "price": 249,
    "cost": 110
  }
]
```

**Note:** Stock is NOT tracked per variation. It's tracked at the product level.

---

## Troubleshooting

### Error: "relation 'products' already exists"
**Solution:** You already have tables. Use `MIGRATION_ADD_PRODUCT_TYPE.sql` instead.

### Error: "column 'product_type' already exists"
**Solution:** Your database is already up to date! No migration needed.

### Error: "permission denied"
**Solution:** Make sure you're using the correct Supabase project and have admin access.

---

## Files Summary

| File | Use Case | Creates Tables | Adds Data |
|------|----------|----------------|-----------|
| `SUPABASE_SCHEMA_UPDATED.sql` | Fresh database | ✅ Yes | ✅ Sample products |
| `MIGRATION_ADD_PRODUCT_TYPE.sql` | Existing database | ❌ No | ❌ No |
| `SUPABASE_SCHEMA.sql` (old) | ⚠️ Missing product_type | ✅ Yes | ✅ Sample products |

---

## Next Steps After Database Setup

1. ✅ Run appropriate SQL script
2. ✅ Create `product-images` storage bucket
3. ✅ Verify columns in Table Editor
4. 🚀 Start using your admin panel!

---

## Need Help?

- Check Supabase logs in SQL Editor for detailed error messages
- Verify your environment variables in `.env.local` are correct
- Make sure your Supabase URL and keys are set properly
