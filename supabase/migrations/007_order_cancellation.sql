-- Allow users to cancel their own orders (update status to cancelled)
DROP POLICY IF EXISTS "Users can cancel their own orders" ON orders;

CREATE POLICY "Users can cancel their own orders"
ON orders FOR UPDATE
TO authenticated
USING (user_id = auth.uid() AND status IN ('pending', 'confirmed'))
WITH CHECK (user_id = auth.uid() AND status = 'cancelled');

-- Add cancelled_at timestamp
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;

-- Add refund tracking columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_status TEXT DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_id TEXT DEFAULT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ;
