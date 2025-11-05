-- Update accessory categories with banners and descriptions
-- Run this in Supabase SQL Editor

UPDATE public.categories 
SET slug = 'day-da-dong-ho',
    banner_url = '/images/day_DH_banner.jpg',
    description = 'Dây đồng hồ cao cấp, đẹp, chính hãng',
    meta_title = 'Dây đồng hồ cao cấp chính hãng - Huy Hoàng Watch',
    meta_description = 'Dây đồng hồ cao cấp, đẹp, chính hãng tại Huy Hoàng Watch. Đa dạng chất liệu: da, kim loại, cao su, vải.'
WHERE name = 'Phụ kiện Dây đồng hồ';

UPDATE public.categories 
SET slug = 'khoa',
    banner_url = '/images/khoa_DH_banner.avif',
    description = 'Khóa bướm đồng hồ chính hãng: Siêu bền, đủ size, đủ màu',
    meta_title = 'Khóa bướm đồng hồ chính hãng - Huy Hoàng Watch',
    meta_description = 'Khóa bướm đồng hồ chính hãng tại Huy Hoàng Watch. Siêu bền, đủ size, đủ màu, lắp đặt miễn phí.'
WHERE name = 'Phụ kiện Khóa đồng hồ';
