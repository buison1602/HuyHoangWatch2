-- Update brand banners and descriptions
-- Run this in Supabase SQL Editor

UPDATE public.brands 
SET banner_url = '/images/dong-ho-casio-chinh-hang.avif',
    description = 'Đồng hồ Casio chính hãng, mẫu mới 2025'
WHERE slug = 'casio';

UPDATE public.brands 
SET banner_url = '/images/dong-ho-citizen-chinh-hang.avif',
    description = 'Đồng hồ Citizen chính hãng: Mẫu mới, Review, Giá, Tư vấn mua'
WHERE slug = 'citizen';

UPDATE public.brands 
SET banner_url = '/images/dong-ho-orient-chinh-hang.avif',
    description = 'Đồng hồ Orient chính hãng: Mẫu mới, Review, Bảng Giá, Tư vấn'
WHERE slug = 'orient';

UPDATE public.brands 
SET banner_url = '/images/seiko-presage-classic-series.avif',
    description = 'Đồng hồ Seiko chính hãng: Giá, Mẫu mới, Review bởi chuyên gia'
WHERE slug = 'seiko';

UPDATE public.brands 
SET banner_url = '/images/shop-dong-ho-omega-chinh-hang-tphcm_1633760511.jpg.webp',
    description = 'Đồng hồ Omega chính hãng: Giá, Mẫu mới, Review bởi chuyên gia'
WHERE slug = 'omega';
