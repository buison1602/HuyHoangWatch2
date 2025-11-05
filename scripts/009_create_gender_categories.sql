-- Create/Update gender-based categories with banner images and descriptions
-- Run this in Supabase SQL Editor

-- Insert Đồng hồ nam (if not exists)
INSERT INTO public.categories (name, description, slug, banner_url, meta_title, meta_description)
VALUES (
  'Đồng hồ nam',
  'Đồng hồ nam đẹp chính hãng, cao cấp, mẫu mới 2025.',
  'dong-ho-nam',
  '/images/banner-dong-ho-nam.avif',
  'Đồng hồ nam chính hãng cao cấp - Huy Hoàng Watch',
  'Khám phá bộ sưu tập đồng hồ nam chính hãng cao cấp tại Huy Hoàng Watch. Thiết kế sang trọng, chất lượng đảm bảo, giá tốt nhất.'
)
ON CONFLICT (slug) DO UPDATE SET
  banner_url = EXCLUDED.banner_url,
  description = EXCLUDED.description,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description;

-- Insert Đồng hồ cặp đôi (if not exists)
INSERT INTO public.categories (name, description, slug, banner_url, meta_title, meta_description)
VALUES (
  'Đồng hồ cặp đôi',
  '300+ Đồng hồ đôi (cặp) đẹp, chính hãng 100%',
  'dong-ho-cap-doi',
  '/images/dong-ho-cap-doi.avif',
  'Đồng hồ cặp đôi chính hãng - Huy Hoàng Watch',
  'Đồng hồ cặp đôi chính hãng tại Huy Hoàng Watch. Thiết kế đồng điệu, ý nghĩa, quà tặng hoàn hảo cho người thương.'
)
ON CONFLICT (slug) DO UPDATE SET
  banner_url = EXCLUDED.banner_url,
  description = EXCLUDED.description,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description;

-- Update Đồng hồ nữ (should already exist)
UPDATE public.categories 
SET banner_url = '/images/banner-dong-ho-nu-chinh-hang-cao-cap.avif',
    description = 'Đồng hồ nữ đẹp, cao cấp chính hãng 100%'
WHERE slug = 'dong-ho-nu';

