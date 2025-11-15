-- Allow users to update their own orders (for status changes after payment)
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;

CREATE POLICY "Users can update their own orders"
ON orders FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
