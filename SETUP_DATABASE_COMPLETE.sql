-- ⚡ COMPLETE DATABASE SETUP
-- Run this in Supabase SQL Editor

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert all 7 products
INSERT INTO products (name, slug, description, price, category, image_url, images, benefits, ingredients, usage_instructions, stock_quantity, is_active) VALUES 
('Bio-Collagen Sachet', 'bio-collagen', 'Premium marine collagen supplement for comprehensive health and beauty from within', 2499.00, 'wellness', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800', ARRAY['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800','https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800'], 'Skin Health & Anti-Aging, Hair & Nail Strength, Muscle Recovery, Gut Repair, Longevity', 'Hydrolyzed Marine Collagen 10g, Vitamin C, Hyaluronic Acid, Biotin', 'Mix one sachet with water daily', 100, true),

('Revive Female Health', 'revive-female-health', 'PCOS and hormonal health formula', 2799.00, 'wellness', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800', ARRAY['https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800'], 'PCOS Support, Hormonal Balance, Energy', 'Myo-Inositol, D-Chiro-Inositol, Vitamin D3', 'One sachet daily with meals', 100, true),

('Day & Night 24 Hrs Magic', 'anti-aging-capsule', 'India''s First 24 Hrs Anti-Aging Regimen', 3299.00, 'skincare', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800', ARRAY['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800'], 'Advanced Anti-Aging, 24-Hour Protection, Cellular Renewal', 'Resveratrol, CoQ10, Vitamin E, Retinol, Melatonin', 'Day capsule AM, Night capsule PM', 100, true),

('Cell Repair Serum', 'cell-repair-serum', 'Ultra advanced dual peptide face serum', 3999.00, 'skincare', 'https://images.unsplash.com/photo-1620916297894-5c66b8afa2d7?w=800', ARRAY['https://images.unsplash.com/photo-1620916297894-5c66b8afa2d7?w=800'], 'Cellular Repair, Collagen Boost, Firmness', 'Dual Peptides, Niacinamide, Hyaluronic Acid, Vitamin C', '2-3 drops morning and evening', 100, true),

('Solligent SPF Shield', 'solligent-spf', 'Intelligent sunscreen + antioxidant shield', 2299.00, 'skincare', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800', ARRAY['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800'], 'SPF 50+, Blue Light Protection, Anti-Pollution', 'Zinc Oxide, Titanium Dioxide, Vitamin E', 'Apply 15 min before sun exposure', 100, true),

('ExoSkin DNA Serum', 'exoskin-dna-serum', 'Salmon DNA + exosomes advanced serum', 5999.00, 'skincare', 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800', ARRAY['https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800'], 'DNA Repair, Exosome Technology, PDRN', 'Salmon DNA, Exosomes, Triple Peptides', '3-4 drops on clean skin PM', 100, true),

('Biome Gut Repair', 'biome-gut-repair', 'Probiotic + prebiotic gut health gummies', 1999.00, 'wellness', 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800', ARRAY['https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800'], 'Microbiome Balance, Digestive Health, Immunity', 'Probiotics 10B CFU, Prebiotics, Postbiotics', '2 gummies daily', 100, true);

-- Verify
SELECT name, slug, price, category FROM products ORDER BY created_at DESC;
