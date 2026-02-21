-- Migration Script - Add product_type column to existing database
-- Run this if you already have a database and just need to add the missing column

-- Add product_type column if it doesn't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS product_type TEXT;

-- Add column comment for sizes structure (updated to reflect no stock per variation)
COMMENT ON COLUMN products.sizes IS 
'JSONB array of product variations. Each variation has: 
{
  "label": "8\" × 10\"",
  "price": 189.00,
  "cost": 85.00
}
Stock is tracked at the product level, not per variation.';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully!';
  RAISE NOTICE 'Added product_type column to products table.';
  RAISE NOTICE 'Updated sizes column documentation.';
  RAISE NOTICE '';
  RAISE NOTICE 'Your database is now ready for the variations system!';
END $$;
