-- Tsuyanouchi E-Commerce Database Schema - Updated for Variations System
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2),
  category TEXT NOT NULL,
  product_type TEXT,
  image_url TEXT NOT NULL DEFAULT '',
  stock INTEGER NOT NULL DEFAULT 0,
  sizes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  taxes DECIMAL(10, 2) NOT NULL,
  shipping DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  payment_intent_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipping Rates Table
CREATE TABLE IF NOT EXISTS shipping_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country_code TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Favorites Table (optional, for future user accounts)
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shipping_rates_country ON shipping_rates(country_code);

-- Insert default shipping rates
INSERT INTO shipping_rates (name, country_code, price) VALUES
  ('Standard Shipping - United States', 'US', 9.99),
  ('Express Shipping - United States', 'US', 24.99),
  ('Standard Shipping - Canada', 'CA', 14.99),
  ('Standard Shipping - United Kingdom', 'GB', 19.99),
  ('Standard Shipping - Australia', 'AU', 24.99),
  ('Standard Shipping - Japan', 'JP', 19.99),
  ('International Shipping', 'INTL', 29.99)
ON CONFLICT DO NOTHING;

-- Insert sample products with variations (optional, for testing)
INSERT INTO products (name, description, price, cost, category, product_type, image_url, stock, sizes) VALUES
  (
    'Mountain Landscape Print',
    'A stunning mountain landscape photograph printed on premium paper. Perfect for modern minimalist spaces.',
    189.00,
    85.00,
    'Art Prints',
    'Single Print',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800',
    0,
    '[
      {"label": "8\" × 10\"", "price": 189, "cost": 85},
      {"label": "11\" × 14\"", "price": 249, "cost": 110},
      {"label": "16\" × 20\"", "price": 329, "cost": 145},
      {"label": "18\" × 24\"", "price": 389, "cost": 170}
    ]'::jsonb
  ),
  (
    'Obsidian Vase',
    'A hand-carved obsidian vase with minimalist design. Perfect for displaying seasonal flowers or as a standalone sculptural piece.',
    189.00,
    85.00,
    'Home Decor',
    NULL,
    'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=800',
    15,
    '[]'::jsonb
  ),
  (
    'Ceramic Tea Set',
    'Traditional Japanese ceramic tea set with modern aesthetics. Includes teapot and four cups with matte black finish.',
    145.00,
    60.00,
    'Kitchen',
    NULL,
    'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&q=80&w=800',
    8,
    '[]'::jsonb
  ),
  (
    'Essential Oil Diffuser',
    'Handcrafted ceramic diffuser with ambient LED lighting. Creates a calming atmosphere for wellness and relaxation.',
    95.00,
    40.00,
    'Wellness',
    NULL,
    'https://images.unsplash.com/photo-1602524206684-76b7c36f90b0?auto=format&fit=crop&q=80&w=800',
    12,
    '[]'::jsonb
  )
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Public read access for shipping rates" ON shipping_rates
  FOR SELECT USING (true);

-- Create policies for authenticated operations
-- Note: For now, we'll allow all operations since we use service role key
-- In production with user auth, you should create more restrictive policies

CREATE POLICY "Allow all operations on products" ON products
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on orders" ON orders
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on shipping_rates" ON shipping_rates
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on favorites" ON favorites
  FOR ALL USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to update updated_at automatically
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipping_rates_updated_at BEFORE UPDATE ON shipping_rates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add column comment for sizes structure
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
  RAISE NOTICE 'Database schema created successfully!';
  RAISE NOTICE 'Sample products have been added (including one with variations).';
  RAISE NOTICE 'Default shipping rates have been configured.';
  RAISE NOTICE 'Remember to create a storage bucket named "product-images" in the Supabase Storage section.';
  RAISE NOTICE '';
  RAISE NOTICE 'Variations Structure:';
  RAISE NOTICE 'Each product can have multiple size variations stored in the sizes JSONB column.';
  RAISE NOTICE 'Format: [{"label": "size", "price": 0, "cost": 0}, ...]';
END $$;
