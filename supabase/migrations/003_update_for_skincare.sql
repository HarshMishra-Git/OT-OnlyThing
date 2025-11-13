-- ============================================================
-- UPDATE DATABASE FOR SKINCARE & WELLNESS FOCUS
-- Date: 2025-11-13
-- Purpose: Align with Only Thing Health & Wellness branding
-- ============================================================

-- ============================================
-- 1. UPDATE DEFAULT CATEGORIES
-- ============================================

-- Clear existing test categories
DELETE FROM categories WHERE slug IN ('electronics', 'fashion', 'home-living', 'books', 'sports');

-- Insert skincare-specific categories
INSERT INTO categories (name, slug, description, is_active, display_order) VALUES
  ('Intelligent Skincare', 'intelligent-skincare', 'Science-backed intelligent skincare solutions that adapt to your skin needs', true, 1),
  ('Smart Serums', 'smart-serums', 'Advanced bioactive serums powered by cellular science', true, 2),
  ('Cleansers & Toners', 'cleansers-toners', 'Gentle yet effective cleansing solutions for all skin types', true, 3),
  ('Moisturizers & Creams', 'moisturizers-creams', 'Deep hydration with adaptive bioactive ingredients', true, 4),
  ('Face Masks & Treatments', 'face-masks-treatments', 'Intensive treatment masks for targeted skin concerns', true, 5),
  ('Eye Care', 'eye-care', 'Specialized care for delicate eye area', true, 6),
  ('Sun Protection', 'sun-protection', 'Intelligent UV protection with skin-nourishing actives', true, 7),
  ('Smart Nutrition', 'smart-nutrition', 'Gut-brain-skin axis supplements for holistic wellness', true, 8),
  ('Wellness Supplements', 'wellness-supplements', 'Data-driven nutritional supplements for overall health', true, 9),
  ('Gift Sets', 'gift-sets', 'Curated skincare collections for complete routines', true, 10)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order;

-- ============================================
-- 2. ADD SKINCARE-SPECIFIC FIELDS TO PRODUCTS
-- ============================================

-- Add skincare-specific columns
ALTER TABLE products ADD COLUMN IF NOT EXISTS skin_type TEXT[] DEFAULT '{}'; 
-- Options: 'dry', 'oily', 'combination', 'sensitive', 'normal', 'all'

ALTER TABLE products ADD COLUMN IF NOT EXISTS skin_concern TEXT[] DEFAULT '{}';
-- Options: 'acne', 'aging', 'pigmentation', 'dryness', 'dullness', 'sensitivity', 'dark-spots', 'fine-lines', 'dark-circles'

ALTER TABLE products ADD COLUMN IF NOT EXISTS key_ingredients TEXT[] DEFAULT '{}';
-- e.g., 'niacinamide', 'hyaluronic-acid', 'vitamin-c', 'retinol', 'peptides'

ALTER TABLE products ADD COLUMN IF NOT EXISTS usage_time TEXT;
-- Options: 'morning', 'night', 'both', 'as-needed'

ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type TEXT;
-- Options: 'cleanser', 'toner', 'serum', 'moisturizer', 'mask', 'sunscreen', 'eye-cream', 'supplement'

ALTER TABLE products ADD COLUMN IF NOT EXISTS size_ml DECIMAL(10,2);
-- Product size in ml or grams

ALTER TABLE products ADD COLUMN IF NOT EXISTS dermatologist_tested BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS cruelty_free BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS vegan BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS paraben_free BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sulfate_free BOOLEAN DEFAULT true;

-- ============================================
-- 3. CREATE SKIN PROFILE TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS skin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  
  -- Skin assessment
  skin_type TEXT CHECK (skin_type IN ('dry', 'oily', 'combination', 'sensitive', 'normal')),
  primary_concern TEXT,
  secondary_concerns TEXT[] DEFAULT '{}',
  
  -- Preferences
  preferred_ingredients TEXT[] DEFAULT '{}',
  ingredients_to_avoid TEXT[] DEFAULT '{}',
  
  -- Quiz results
  quiz_score JSONB DEFAULT '{}',
  recommended_routine JSONB DEFAULT '{}',
  
  -- AI recommendations
  ai_recommended_products UUID[] DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_skin_profiles_user ON skin_profiles(user_id);

-- RLS
ALTER TABLE skin_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own skin profile" ON skin_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own skin profile" ON skin_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all skin profiles" ON skin_profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Trigger
CREATE TRIGGER update_skin_profiles_updated_at
  BEFORE UPDATE ON skin_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. UPDATE QUIZ TABLE FOR SKINCARE
-- ============================================

-- Drop old quiz_answers and create skincare-specific one
DROP TABLE IF EXISTS quiz_answers CASCADE;

CREATE TABLE skin_quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  
  -- Quiz responses (skincare specific)
  skin_type_response TEXT,
  primary_concern_response TEXT,
  secondary_concerns_response TEXT[] DEFAULT '{}',
  current_routine_response TEXT,
  age_group_response TEXT,
  lifestyle_response TEXT,
  climate_response TEXT,
  budget_response TEXT,
  
  -- Results
  calculated_skin_type TEXT,
  recommended_products UUID[] DEFAULT '{}',
  recommended_routine JSONB DEFAULT '{}',
  personalization_score INT,
  
  -- Metadata
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Index
CREATE INDEX idx_skin_quiz_user ON skin_quiz_responses(user_id);
CREATE INDEX idx_skin_quiz_session ON skin_quiz_responses(session_id);
CREATE INDEX idx_skin_quiz_completed ON skin_quiz_responses(completed_at DESC);

-- RLS
ALTER TABLE skin_quiz_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own quiz responses" ON skin_quiz_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can submit quiz" ON skin_quiz_responses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin view all quiz responses" ON skin_quiz_responses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- ============================================
-- 5. CREATE INGREDIENT DATABASE
-- ============================================

CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  scientific_name TEXT,
  slug TEXT UNIQUE NOT NULL,
  
  -- Properties
  category TEXT, -- 'active', 'moisturizer', 'preservative', 'fragrance'
  benefits TEXT[] DEFAULT '{}',
  skin_types TEXT[] DEFAULT '{}', -- which skin types benefit most
  concerns_addressed TEXT[] DEFAULT '{}',
  
  -- Science
  clinical_evidence TEXT,
  efficacy_rating DECIMAL(3,2) CHECK (efficacy_rating >= 0 AND efficacy_rating <= 5),
  
  -- Safety
  is_safe_for_pregnancy BOOLEAN DEFAULT false,
  is_safe_for_breastfeeding BOOLEAN DEFAULT false,
  common_concentration_range TEXT, -- e.g., "2-5%"
  
  -- Info
  description TEXT,
  how_it_works TEXT,
  side_effects TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_ingredients_slug ON ingredients(slug);
CREATE INDEX idx_ingredients_category ON ingredients(category);

-- RLS
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view ingredients" ON ingredients
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage ingredients" ON ingredients
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- Link ingredients to products
CREATE TABLE IF NOT EXISTS product_ingredients (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  concentration TEXT,
  position_in_list INT, -- Order in ingredient list
  PRIMARY KEY (product_id, ingredient_id)
);

-- RLS
ALTER TABLE product_ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view product ingredients" ON product_ingredients
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage product ingredients" ON product_ingredients
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- ============================================
-- 6. UPDATE BLOG CATEGORIES FOR SKINCARE
-- ============================================

INSERT INTO blog_categories (name, slug) VALUES
  ('Skincare Science', 'skincare-science'),
  ('Ingredient Deep Dives', 'ingredient-deep-dives'),
  ('Skin Concerns', 'skin-concerns'),
  ('Wellness Tips', 'wellness-tips'),
  ('Product Guides', 'product-guides'),
  ('Expert Advice', 'expert-advice'),
  ('Clinical Research', 'clinical-research')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 7. SAMPLE SKINCARE PRODUCTS
-- ============================================

-- Add sample intelligent skincare products
INSERT INTO products (
  name, 
  slug, 
  description,
  short_description,
  price, 
  compare_price,
  category_id, 
  stock_quantity, 
  is_active, 
  is_featured,
  sku,
  skin_type,
  skin_concern,
  key_ingredients,
  usage_time,
  product_type,
  size_ml,
  dermatologist_tested,
  cruelty_free,
  vegan,
  paraben_free,
  sulfate_free
)
SELECT 
  'Intelligent Vitamin C Serum',
  'intelligent-vitamin-c-serum',
  'Our breakthrough Vitamin C serum uses adaptive bioactive technology to deliver 15% L-Ascorbic Acid with enhanced stability. Clinically proven to reduce hyperpigmentation by 42% in 8 weeks. Brightens, evens skin tone, and protects against environmental damage.',
  'Science-backed Vitamin C serum that adapts to your skin',
  1499.00,
  1999.00,
  id,
  100,
  true,
  true,
  'OT-VC-001',
  ARRAY['all'],
  ARRAY['pigmentation', 'dullness', 'dark-spots'],
  ARRAY['vitamin-c', 'hyaluronic-acid', 'ferulic-acid'],
  'morning',
  'serum',
  30.00,
  true,
  true,
  true,
  true,
  true
FROM categories WHERE slug = 'smart-serums'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
  name, 
  slug, 
  description,
  short_description,
  price, 
  category_id, 
  stock_quantity, 
  is_active, 
  is_featured,
  sku,
  skin_type,
  skin_concern,
  key_ingredients,
  usage_time,
  product_type,
  size_ml,
  dermatologist_tested,
  cruelty_free,
  paraben_free
)
SELECT 
  'Adaptive Niacinamide Solution 10%',
  'adaptive-niacinamide-solution',
  'High-strength 10% Niacinamide with Zinc PCA for oil control and pore refinement. Our intelligent formula adjusts to your skin pH for maximum efficacy. Reduces excess sebum by 35% and minimizes pore appearance.',
  'Intelligent pore-refining serum with 10% Niacinamide',
  899.00,
  id,
  150,
  true,
  true,
  'OT-NIA-002',
  ARRAY['oily', 'combination', 'acne-prone'],
  ARRAY['acne', 'large-pores', 'oily-skin'],
  ARRAY['niacinamide', 'zinc-pca', 'hyaluronic-acid'],
  'both',
  'serum',
  30.00,
  true,
  true,
  true
FROM categories WHERE slug = 'smart-serums'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
  name, 
  slug, 
  description,
  short_description,
  price, 
  category_id, 
  stock_quantity, 
  is_active,
  sku,
  skin_type,
  skin_concern,
  key_ingredients,
  usage_time,
  product_type,
  size_ml,
  dermatologist_tested,
  cruelty_free
)
SELECT 
  'Bio-Retinol Night Renewal Complex',
  'bio-retinol-night-renewal',
  'Next-generation retinol alternative derived from plant stem cells. Delivers anti-aging benefits without irritation. Clinical studies show 38% reduction in fine lines and 44% improvement in skin texture after 12 weeks.',
  'Gentle yet powerful plant-based retinol alternative',
  1799.00,
  id,
  80,
  true,
  'OT-RET-003',
  ARRAY['all'],
  ARRAY['aging', 'fine-lines', 'texture'],
  ARRAY['bakuchiol', 'peptides', 'squalane'],
  'night',
  'serum',
  30.00,
  true,
  true
FROM categories WHERE slug = 'smart-serums'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (
  name, 
  slug, 
  description,
  short_description,
  price, 
  category_id, 
  stock_quantity, 
  is_active,
  sku,
  skin_type,
  skin_concern,
  key_ingredients,
  usage_time,
  product_type,
  size_ml,
  dermatologist_tested
)
SELECT 
  'Intelligent Hydration Barrier Cream',
  'intelligent-hydration-barrier-cream',
  'Smart moisturizer that adapts to your skin hydration levels. Contains ceramide complex and adaptive hyaluronic acid that adjusts molecular weight based on skin needs. Strengthens skin barrier by 56% in 4 weeks.',
  'Adaptive moisturizer that responds to your skin needs',
  1299.00,
  id,
  120,
  true,
  'OT-MOIST-004',
  ARRAY['all'],
  ARRAY['dryness', 'sensitivity', 'barrier-damage'],
  ARRAY['ceramides', 'hyaluronic-acid', 'niacinamide'],
  'both',
  'moisturizer',
  50.00,
  true
FROM categories WHERE slug = 'moisturizers-creams'
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 8. SAMPLE INGREDIENTS
-- ============================================

INSERT INTO ingredients (name, scientific_name, slug, category, benefits, skin_types, concerns_addressed, efficacy_rating, is_safe_for_pregnancy, description) VALUES
  ('Niacinamide', 'Nicotinamide', 'niacinamide', 'active', ARRAY['oil-control', 'pore-minimizing', 'brightening'], ARRAY['all'], ARRAY['acne', 'hyperpigmentation', 'large-pores'], 4.8, true, 'Form of Vitamin B3 that regulates sebum and strengthens skin barrier'),
  ('Vitamin C', 'L-Ascorbic Acid', 'vitamin-c', 'active', ARRAY['brightening', 'antioxidant', 'anti-aging'], ARRAY['all'], ARRAY['pigmentation', 'dullness', 'aging'], 4.9, true, 'Powerful antioxidant that brightens and protects skin'),
  ('Hyaluronic Acid', 'Sodium Hyaluronate', 'hyaluronic-acid', 'moisturizer', ARRAY['hydration', 'plumping'], ARRAY['all'], ARRAY['dryness', 'fine-lines'], 4.7, true, 'Humectant that holds 1000x its weight in water'),
  ('Retinol', 'Vitamin A', 'retinol', 'active', ARRAY['anti-aging', 'cell-turnover'], ARRAY['normal', 'oily'], ARRAY['aging', 'fine-lines', 'texture'], 4.9, false, 'Gold standard anti-aging ingredient'),
  ('Bakuchiol', 'Plant Retinol Alternative', 'bakuchiol', 'active', ARRAY['anti-aging', 'gentle'], ARRAY['all'], ARRAY['aging', 'sensitivity'], 4.5, true, 'Plant-based retinol alternative without irritation')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- COMPLETE!
-- ============================================

-- Verify updates
SELECT 'Categories Updated:' as status, COUNT(*)::text as count FROM categories
UNION ALL
SELECT 'Skincare Products Added:', COUNT(*)::text FROM products
UNION ALL
SELECT 'Ingredients Database:', COUNT(*)::text FROM ingredients;