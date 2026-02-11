-- ============================================
-- TSUYA NO UCHI - Supabase Database Setup
-- ============================================
-- Run this entire script in your Supabase SQL Editor
-- This will create all tables, indexes, and security policies

-- ============================================
-- STEP 1: CREATE TABLES
-- ============================================

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  cost NUMERIC(10, 2),
  category TEXT NOT NULL,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  sizes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  taxes NUMERIC(10, 2) NOT NULL,
  shipping NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  payment_intent_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shipping Rates table
CREATE TABLE IF NOT EXISTS shipping_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country_code TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(country_code)
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ============================================
-- STEP 2: CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent_id ON orders(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_shipping_rates_country ON shipping_rates(country_code);
CREATE INDEX IF NOT EXISTS idx_favorites_user_product ON favorites(user_id, product_id);

-- ============================================
-- STEP 3: ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 4: CREATE RLS POLICIES
-- ============================================

-- Products Policies
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin full access to products" ON products;
CREATE POLICY "Allow admin full access to products" ON products FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Categories Policies
DROP POLICY IF EXISTS "Allow public read access to categories" ON categories;
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin full access to categories" ON categories;
CREATE POLICY "Allow admin full access to categories" ON categories FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Orders Policies
DROP POLICY IF EXISTS "Allow orders insert for checkout" ON orders;
CREATE POLICY "Allow orders insert for checkout" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin full access to orders" ON orders;
CREATE POLICY "Allow admin full access to orders" ON orders FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Shipping Rates Policies
DROP POLICY IF EXISTS "Allow public read shipping_rates" ON shipping_rates;
CREATE POLICY "Allow public read shipping_rates" ON shipping_rates FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin full access to shipping_rates" ON shipping_rates;
CREATE POLICY "Allow admin full access to shipping_rates" ON shipping_rates FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Favorites Policies
DROP POLICY IF EXISTS "Allow user to view their own favorites" ON favorites;
CREATE POLICY "Allow user to view their own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow user to insert their own favorites" ON favorites;
CREATE POLICY "Allow user to insert their own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow user to delete their own favorites" ON favorites;
CREATE POLICY "Allow user to delete their own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- STEP 5: INSERT DEFAULT SHIPPING RATES
-- ============================================

INSERT INTO shipping_rates (name, country_code, price) VALUES
  ('United States - Standard', 'US', 5.99),
  ('Canada - Standard', 'CA', 8.99),
  ('United Kingdom - Standard', 'GB', 9.99),
  ('Australia - Standard', 'AU', 12.99),
  ('International - Standard', 'INTL', 15.99)
ON CONFLICT (country_code) DO NOTHING;

-- ============================================
-- COMPLETE! 
-- ============================================
-- Next steps:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create a new bucket named: product-images
-- 3. Make it Public
-- 4. You're ready to use the app!
