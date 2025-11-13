-- ⚡ COMPLETE FIX FOR PRODUCTS DISPLAY ISSUE
-- Run this in Supabase SQL Editor

-- 1. Drop existing public policy and create new one for both public and anon
DROP POLICY IF EXISTS "Anyone can view active products" ON products;

-- Create new policy that explicitly allows anon role (used by Supabase client)
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Make absolutely sure anon role can read products
GRANT SELECT ON products TO anon;
GRANT SELECT ON products TO authenticated;

-- 2. Update image URLs to use reliable sources
-- Replace any broken Unsplash URLs with working alternatives

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80' WHERE slug = 'bio-collagen';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80' WHERE slug = 'revive-female-health';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80' WHERE slug = 'anti-aging-capsule';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1620916297894-5c66b8afa2d7?w=800&q=80' WHERE slug = 'cell-repair-serum';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80' WHERE slug = 'solligent-spf';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80' WHERE slug = 'exoskin-dna-serum';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80' WHERE slug = 'biome-gut-repair';

-- 3. Verify everything is working
SELECT 
  name, 
  slug, 
  price, 
  category, 
  is_active,
  image_url
FROM products 
ORDER BY created_at DESC;

-- 4. Check RLS policies
SELECT schemaname, tablename, policyname, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'products';
