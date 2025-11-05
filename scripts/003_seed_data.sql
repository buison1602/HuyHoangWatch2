-- Seed categories
INSERT INTO public.categories (name, description) VALUES
  ('Luxury', 'Premium luxury watches'),
  ('Sports', 'Sports and athletic watches'),
  ('Casual', 'Casual everyday watches'),
  ('Dress', 'Formal dress watches')
ON CONFLICT (name) DO NOTHING;

-- Seed sample products
INSERT INTO public.products (name, description, price, category_id, gender, strap_type, services, stock_quantity)
SELECT
  'Classic Leather Watch',
  'Elegant leather strap watch perfect for any occasion',
  299.99,
  (SELECT id FROM public.categories WHERE name = 'Dress'),
  'unisex',
  'leather',
  ARRAY['battery_replacement', 'strap_change'],
  50
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Classic Leather Watch');

INSERT INTO public.products (name, description, price, category_id, gender, strap_type, services, stock_quantity)
SELECT
  'Sports Chronograph',
  'Durable sports watch with chronograph function',
  449.99,
  (SELECT id FROM public.categories WHERE name = 'Sports'),
  'male',
  'rubber',
  ARRAY['battery_replacement', 'waterproof_check'],
  30
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Sports Chronograph');

INSERT INTO public.products (name, description, price, category_id, gender, strap_type, services, stock_quantity)
SELECT
  'Luxury Gold Watch',
  'Premium gold-plated luxury watch',
  1299.99,
  (SELECT id FROM public.categories WHERE name = 'Luxury'),
  'female',
  'metal',
  ARRAY['battery_replacement', 'strap_change', 'polishing'],
  15
WHERE NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Luxury Gold Watch');
