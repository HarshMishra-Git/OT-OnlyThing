-- Insert real ONLY THING products with colorful images

-- First, clear existing products (optional, for clean slate)
-- DELETE FROM products;

-- Insert products with real details and vibrant images
INSERT INTO products (
  name,
  slug,
  description,
  price,
  category,
  image_url,
  images,
  benefits,
  ingredients,
  usage_instructions,
  stock_quantity,
  is_active
) VALUES 
(
  'Bio-Collagen Sachet',
  'bio-collagen',
  'Premium marine collagen supplement for comprehensive health and beauty from within. Supports skin elasticity, hair strength, and overall vitality.',
  2499.00,
  'Wellness',
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=800&fit=crop&q=80'
  ],
  'Skin Health & Anti-Aging, Hair & Nail Strength, Muscle Recovery & Lean Mass Strength, Gut & Tissue Repair, Longevity Support',
  'Hydrolyzed Marine Collagen (10g), Vitamin C, Hyaluronic Acid, Biotin, Zinc',
  'Mix one sachet with 200ml water or your favorite beverage. Consume daily, preferably in the morning.',
  100,
  true
),
(
  'Revive Female Health Sachet',
  'revive-female-health',
  'Comprehensive female wellness formula specifically designed to target PCOS and overall hormonal health. Support your body naturally.',
  2799.00,
  'Wellness',
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=800&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=800&fit=crop&q=80'
  ],
  'PCOS Support, Hormonal Balance, Female Overall Health, Reproductive Wellness, Energy & Vitality',
  'Myo-Inositol (2g), D-Chiro-Inositol (50mg), Vitamin D3 (2000 IU), Folic Acid (400mcg), Chromium',
  'Take one sachet daily with meals, preferably at the same time each day for best results.',
  100,
  true
),
(
  'Day & Night 24 Hrs Magic',
  'anti-aging-capsule',
  'India''s First 24 Hrs Anti-Aging Regimen. Advanced dual-formula system working around the clock for maximum cellular renewal and protection.',
  3299.00,
  'Skincare',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=800&fit=crop&q=80'
  ],
  'Advanced Anti-Aging Formula, 24-Hour Protection, Cellular Renewal, Skin Radiance, Wrinkle Reduction',
  'Day Capsule: Resveratrol, Coenzyme Q10, Vitamin E, Astaxanthin. Night Capsule: Retinol, Melatonin, Collagen Peptides',
  'Take Day capsule in morning with breakfast. Take Night capsule 30 minutes before bedtime.',
  100,
  true
),
(
  'Cell Repair Serum',
  'cell-repair-serum',
  'Ultra advanced face serum with dual peptide complex for intensive cellular renewal. Clinical-grade formula for visible results.',
  3999.00,
  'Skincare',
  'https://images.unsplash.com/photo-1620916297894-5c66b8afa2d7?w=800&h=800&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1620916297894-5c66b8afa2d7?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&h=800&fit=crop&q=80'
  ],
  'Cellular Repair, Collagen Boost, Fine Line Reduction, Skin Firmness, Deep Hydration',
  'Dual Peptide Complex (Matrixyl 3000 + Argireline), Niacinamide 5%, Hyaluronic Acid, Vitamin C, Ceramides',
  'Apply 2-3 drops to clean face and neck, morning and evening. Gently massage until fully absorbed.',
  100,
  true
),
(
  'Solligent SPF Shield',
  'solligent-spf',
  'Next-generation hybrid intelligent sunscreen combining SPF 50+ protection with powerful antioxidants. Lightweight, non-greasy formula.',
  2299.00,
  'Skincare',
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=800&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505944357374-9e1463f162f3?w=800&h=800&fit=crop&q=80'
  ],
  'Broad Spectrum SPF 50+, Blue Light Protection, Anti-Pollution Shield, Antioxidant Defense, Lightweight Formula',
  'Zinc Oxide 15%, Titanium Dioxide 10%, Vitamin E, Niacinamide, Green Tea Extract, Vitamin C',
  'Apply generously 15 minutes before sun exposure. Reapply every 2 hours or after swimming/sweating.',
  100,
  true
),
(
  'ExoSkin DNA Gel-Serum',
  'exoskin-dna-serum',
  'Revolutionary multi-action skin elixir combining salmon sperm DNA, exosomes, PDRN, and peptides. The most advanced serum technology available.',
  5999.00,
  'Skincare',
  'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&h=800&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556228578-dd5e3004150c?w=800&h=800&fit=crop&q=80'
  ],
  'Salmon Sperm DNA Technology, Exosome Delivery System, PDRN Repair, Multi-Peptide Complex, Barrier Restoration',
  'Salmon DNA (PDRN 2%), Exosomes, Triple Peptide Complex, Vitamin B5, Ceramide Complex, Niacinamide',
  'Apply 3-4 drops to clean, damp skin. Gently massage in upward motions until absorbed. Use PM for best results.',
  100,
  true
),
(
  'Biome Gut Repair Gummies',
  'biome-gut-repair',
  'Next-gen gut health gummy combining probiotics, prebiotics, postbiotics, and polyphenols. Delicious berry flavor for daily microbiome support.',
  1999.00,
  'Wellness',
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=800&fit=crop&q=80',
  ARRAY[
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=800&fit=crop&q=80'
  ],
  'Microbiome Balance, Digestive Health, Metabolic Support, Immune Boost, Enhanced Nutrient Absorption',
  '10 Billion CFU Probiotic Blend, Prebiotic Fiber (Inulin), Postbiotics, Polyphenols, Vitamin D, Zinc',
  'Take 2 gummies daily with or without food. Best taken in the morning for optimal absorption.',
  100,
  true
);

-- Update created_at to be recent
UPDATE products SET created_at = NOW() WHERE slug IN (
  'bio-collagen',
  'revive-female-health',
  'anti-aging-capsule',
  'cell-repair-serum',
  'solligent-spf',
  'exoskin-dna-serum',
  'biome-gut-repair'
);
