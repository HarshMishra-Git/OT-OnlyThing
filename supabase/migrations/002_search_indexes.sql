-- ============================================
-- SEARCH IMPROVEMENTS: FTS + TRIGRAM + TSVECTOR
-- ============================================

-- Enable useful extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Add tsvector column for full-text search
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_document tsvector;

-- Backfill existing rows
UPDATE products
SET search_document = to_tsvector('english',
  unaccent(coalesce(name,'') || ' ' || coalesce(description,'') || ' ' || coalesce(short_description,'') || ' ' || coalesce(sku,''))
);

-- GIN index for FTS
CREATE INDEX IF NOT EXISTS idx_products_search_fts ON products USING GIN (search_document);

-- Trigram indexes for fast ILIKE/prefix matching
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_sku_trgm ON products USING GIN (sku gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_slug_trgm ON products USING GIN (slug gin_trgm_ops);

-- Keep tsvector in sync on inserts/updates
CREATE OR REPLACE FUNCTION products_search_document_update()
RETURNS trigger AS $$
BEGIN
  NEW.search_document := to_tsvector('english',
    unaccent(coalesce(NEW.name,'') || ' ' || coalesce(NEW.description,'') || ' ' || coalesce(NEW.short_description,'') || ' ' || coalesce(NEW.sku,''))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tsv_update_products ON products;
CREATE TRIGGER tsv_update_products
  BEFORE INSERT OR UPDATE OF name, description, short_description, sku ON products
  FOR EACH ROW EXECUTE FUNCTION products_search_document_update();

-- ============================================
-- MIGRATION COMPLETE
-- ============================================