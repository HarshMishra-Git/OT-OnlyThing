-- ⚡⚡⚡ ULTIMATE FIX - RUN THIS IN SUPABASE SQL EDITOR ⚡⚡⚡
-- This fixes EVERYTHING in one go

-- ============================================
-- PART 1: CREATE ALL REQUIRED TABLES
-- ============================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  image_url TEXT,
  images TEXT[],
  benefits TEXT,
  ingredients TEXT,
  usage_instructions TEXT,
  stock_quantity INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- ============================================
-- PART 2: ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PART 3: DROP ALL EXISTING POLICIES (CLEAN SLATE)
-- ============================================

DROP POLICY IF EXISTS "Anyone can view active products" ON products;
DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- ============================================
-- PART 4: CREATE NEW POLICIES (PROPER PUBLIC ACCESS)
-- ============================================

-- Products: Anyone can view active products
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Reviews: Anyone can read, authenticated can write
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Profiles: Public read access for names in reviews
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  USING (true);

-- ============================================
-- PART 5: GRANT EXPLICIT PERMISSIONS
-- ============================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON products TO anon, authenticated;
GRANT SELECT ON reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON reviews TO authenticated;
GRANT SELECT ON profiles TO anon, authenticated;

-- ============================================
-- PART 6: ENSURE PRODUCTS EXIST
-- ============================================

-- Delete existing products (if you want fresh data)
-- TRUNCATE products CASCADE;

-- Insert products (only if they don't exist)
INSERT INTO products (name, slug, description, price, category, image_url, benefits, ingredients, usage_instructions, stock_quantity, is_active)
SELECT * FROM (VALUES
  ('Bio-Collagen Sachet', 'bio-collagen', 'Premium marine collagen supplement for comprehensive health and beauty from within', 2499.00, 'wellness', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80', 'Skin Health & Anti-Aging, Hair & Nail Strength, Muscle Recovery, Gut Repair, Longevity', 'Hydrolyzed Marine Collagen 10g, Vitamin C, Hyaluronic Acid, Biotin', 'Mix one sachet with water daily', 100, true),
  ('Revive Female Health', 'revive-female-health', 'PCOS and hormonal health formula', 2799.00, 'wellness', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80', 'PCOS Support, Hormonal Balance, Energy', 'Myo-Inositol, D-Chiro-Inositol, Vitamin D3', 'One sachet daily with meals', 100, true),
  ('Day & Night 24 Hrs Magic', 'anti-aging-capsule', 'India''s First 24 Hrs Anti-Aging Regimen', 3299.00, 'skincare', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80', 'Advanced Anti-Aging, 24-Hour Protection, Cellular Renewal', 'Resveratrol, CoQ10, Vitamin E, Retinol, Melatonin', 'Day capsule AM, Night capsule PM', 100, true),
  ('Cell Repair Serum', 'cell-repair-serum', 'Ultra advanced dual peptide face serum', 3999.00, 'skincare', 'https://images.unsplash.com/photo-1620916297894-5c66b8afa2d7?w=800&q=80', 'Cellular Repair, Collagen Boost, Firmness', 'Dual Peptides, Niacinamide, Hyaluronic Acid, Vitamin C', '2-3 drops morning and evening', 100, true),
  ('Solligent SPF Shield', 'solligent-spf', 'Intelligent sunscreen + antioxidant shield', 2299.00, 'skincare', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80', 'SPF 50+, Blue Light Protection, Anti-Pollution', 'Zinc Oxide, Titanium Dioxide, Vitamin E', 'Apply 15 min before sun exposure', 100, true),
  ('ExoSkin DNA Serum', 'exoskin-dna-serum', 'Salmon DNA + exosomes advanced serum', 5999.00, 'skincare', 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80', 'DNA Repair, Exosome Technology, PDRN', 'Salmon DNA, Exosomes, Triple Peptides', '3-4 drops on clean skin PM', 100, true),
  ('Biome Gut Repair', 'biome-gut-repair', 'Probiotic + prebiotic gut health gummies', 1999.00, 'wellness', 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80', 'Microbiome Balance, Digestive Health, Immunity', 'Probiotics 10B CFU, Prebiotics, Postbiotics', '2 gummies daily', 100, true)
) AS v(name, slug, description, price, category, image_url, benefits, ingredients, usage_instructions, stock_quantity, is_active)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE products.slug = v.slug);

-- ============================================
-- PART 7: CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- ============================================
-- PART 8: VERIFY EVERYTHING
-- ============================================

-- Check counts
SELECT 
  'PRODUCTS' as table_name,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE is_active = true) as active_count
FROM products
UNION ALL
SELECT 
  'REVIEWS' as table_name,
  COUNT(*) as total_count,
  NULL as active_count
FROM reviews
UNION ALL
SELECT 
  'PROFILES' as table_name,
  COUNT(*) as total_count,
  NULL as active_count
FROM profiles;

-- Check policies
SELECT 
  schemaname,
  tablename,
  policyname,
  roles::text,
  cmd
FROM pg_policies 
WHERE tablename IN ('products', 'reviews', 'profiles')
ORDER BY tablename, policyname;

-- Show all products
SELECT 
  name,
  slug,
  price,
  category,
  stock_quantity,
  is_active
FROM products
ORDER BY category, name;

-- ============================================
-- ✅ SUCCESS MESSAGE
-- ============================================
-- If you see products listed above with no errors,
-- everything is set up correctly!
-- 
-- Next: Restart your dev server with: npm run dev
-- Then visit: http://localhost:5173/shop
-- ============================================
