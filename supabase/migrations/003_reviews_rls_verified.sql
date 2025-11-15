-- Verified Purchase via RLS for Reviews
-- Creates a helper function and tightens INSERT/UPDATE policies

-- Helper: check if a user has purchased a product in a paid order
CREATE OR REPLACE FUNCTION has_purchased_product(p_user_id uuid, p_product_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    WHERE o.user_id = p_user_id
      AND o.payment_status = 'paid'
      AND oi.product_id = p_product_id
  );
$$;

-- Tighten INSERT policy: users can insert reviews only for themselves;
-- if they set is_verified_purchase = true, they must have purchased the product.
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND (
      is_verified_purchase = false
      OR has_purchased_product(user_id, product_id)
    )
  );

-- Tighten UPDATE policy: users can update their own reviews but cannot set
-- is_approved = true themselves; and verified flag can only be true if purchased.
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND is_approved = false
    AND (
      is_verified_purchase = false
      OR has_purchased_product(user_id, product_id)
    )
  );

-- Note: Public select and Admin manage policies remain as defined.