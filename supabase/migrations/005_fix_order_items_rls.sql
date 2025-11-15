-- Fix RLS policy for order_items to allow insertion during order creation

-- Drop existing restrictive policy if exists
DROP POLICY IF EXISTS "Users can insert their own order items" ON order_items;

-- Create new policy that allows insertion for authenticated users
CREATE POLICY "Users can insert order items for their orders"
ON order_items FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

-- Allow users to view their own order items
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
CREATE POLICY "Users can view their own order items"
ON order_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);
