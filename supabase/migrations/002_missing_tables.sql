-- ============================================================
-- MISSING TABLES & ENHANCEMENTS
-- Add these to your existing schema
-- Date: 2025-11-13
-- ============================================================

-- ============================================
-- 1. NEWSLETTER SUBSCRIPTIONS
-- ============================================

CREATE TABLE newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX idx_newsletter_status ON newsletter_subscriptions(status);

ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe" ON newsletter_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view subscriptions" ON newsletter_subscriptions FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============================================
-- 2. QUIZ ANSWERS
-- ============================================

CREATE TABLE quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  question_1 TEXT,
  question_2 TEXT,
  question_3 TEXT,
  question_4 TEXT,
  question_5 TEXT,
  recommended_products UUID[] DEFAULT '{}',
  quiz_type TEXT DEFAULT 'product_finder',
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX idx_quiz_user ON quiz_answers(user_id);
CREATE INDEX idx_quiz_session ON quiz_answers(session_id);
CREATE INDEX idx_quiz_completed ON quiz_answers(completed_at DESC);

ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own quiz" ON quiz_answers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can submit quiz" ON quiz_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin view all quiz" ON quiz_answers FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============================================
-- 3. NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('order_update', 'query_response', 'product_restock', 'promotion', 'system', 'admin_alert')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System create notifications" ON notifications FOR INSERT WITH CHECK (true);

-- ============================================
-- 4. COUPONS & USAGE
-- ============================================

CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value DECIMAL(10,2) NOT NULL,
  max_discount DECIMAL(10,2),
  min_order_value DECIMAL(10,2) DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  usage_limit INT,
  usage_count INT DEFAULT 0,
  per_user_limit INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  applicable_categories UUID[] DEFAULT '{}',
  applicable_products UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  discount_applied DECIMAL(10,2) NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(coupon_id, order_id)
);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active) WHERE is_active = true;
CREATE INDEX idx_coupon_usage_user ON coupon_usage(user_id);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view active coupons" ON coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manage coupons" ON coupons FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
CREATE POLICY "Users view own usage" ON coupon_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System create usage" ON coupon_usage FOR INSERT WITH CHECK (true);

-- ============================================
-- 5. ANALYTICS
-- ============================================

CREATE TABLE daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL UNIQUE,
  total_orders INT DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  average_order_value DECIMAL(10,2) DEFAULT 0,
  new_users INT DEFAULT 0,
  active_users INT DEFAULT 0,
  products_sold INT DEFAULT 0,
  top_product_id UUID,
  page_views INT DEFAULT 0,
  unique_visitors INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_daily_metrics_date ON daily_metrics(metric_date DESC);

ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin view metrics" ON daily_metrics FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
CREATE POLICY "System insert metrics" ON daily_metrics FOR INSERT WITH CHECK (true);

-- ============================================
-- 6. ORDER STATUS HISTORY
-- ============================================

CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES profiles(id),
  changed_by_role TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_history_order ON order_status_history(order_id);
CREATE INDEX idx_order_history_created ON order_status_history(created_at DESC);

ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own order history" ON order_status_history FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_status_history.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Admin view all history" ON order_status_history FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Trigger for auto-logging
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO order_status_history (order_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_order_status AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION log_order_status_change();

-- ============================================
-- 7. SEARCH HISTORY
-- ============================================

CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  search_query TEXT NOT NULL,
  results_count INT DEFAULT 0,
  filters_applied JSONB DEFAULT '{}',
  result_clicked BOOLEAN DEFAULT false,
  clicked_product_id UUID REFERENCES products(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_search_user ON search_history(user_id);
CREATE INDEX idx_search_query ON search_history(search_query);
CREATE INDEX idx_search_created ON search_history(created_at DESC);

ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone log searches" ON search_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin view search history" ON search_history FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- ============================================
-- 8. ENHANCEMENTS TO PRODUCTS
-- ============================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS favorite_count INT DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS view_count INT DEFAULT 0;

-- Function to update favorite count
CREATE OR REPLACE FUNCTION update_product_favorite_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE products SET favorite_count = favorite_count + 1 WHERE id = NEW.product_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE products SET favorite_count = GREATEST(favorite_count - 1, 0) WHERE id = OLD.product_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_favorite_count_on_wishlist
  AFTER INSERT OR DELETE ON wishlist_items
  FOR EACH ROW EXECUTE FUNCTION update_product_favorite_count();

-- ============================================
-- COMPLETE!
-- ============================================