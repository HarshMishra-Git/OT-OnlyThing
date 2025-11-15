-- Confirm essential indexes and enforce RLS on critical tables
-- This migration is idempotent and will not duplicate existing indexes.

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = true;

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);

-- Customer queries indexes
CREATE INDEX IF NOT EXISTS idx_queries_status ON customer_queries(status);

-- Enforce RLS on critical tables (enable and force)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE products FORCE ROW LEVEL SECURITY;

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders FORCE ROW LEVEL SECURITY;

ALTER TABLE customer_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_queries FORCE ROW LEVEL SECURITY;

-- Note: FORCE ROW LEVEL SECURITY ensures RLS applies to table owners as well.
-- Supabase's service role still bypasses RLS; policies defined in earlier migrations govern access.