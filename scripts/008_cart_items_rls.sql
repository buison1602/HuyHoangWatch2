-- Enable Row Level Security on cart_items
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can read own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can insert own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete own cart items" ON public.cart_items;

-- Policy: Read own cart items
CREATE POLICY "Users can read own cart items"
ON public.cart_items FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Insert own cart items
CREATE POLICY "Users can insert own cart items"
ON public.cart_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Update own cart items
CREATE POLICY "Users can update own cart items"
ON public.cart_items FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Delete own cart items
CREATE POLICY "Users can delete own cart items"
ON public.cart_items FOR DELETE
USING (auth.uid() = user_id);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'cart_items';
