-- Thêm cột brand_id vào bảng products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL;

-- Tạo index cho brand_id để tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products(brand_id);

-- Comment mô tả cột
COMMENT ON COLUMN public.products.brand_id IS 'Thương hiệu của sản phẩm';
