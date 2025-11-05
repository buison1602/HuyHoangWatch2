-- Tạo bảng brands (thương hiệu)
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tạo index cho tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_brands_name ON public.brands(name);

-- Enable RLS (Row Level Security)
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Policy cho phép tất cả người dùng đọc brands
CREATE POLICY "Allow public read access to brands"
  ON public.brands
  FOR SELECT
  TO public
  USING (true);

-- Policy cho phép admin insert/update/delete brands
CREATE POLICY "Allow authenticated users to manage brands"
  ON public.brands
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed data: Thêm các thương hiệu ban đầu
INSERT INTO public.brands (name, description) VALUES
  ('Casio', 'Thương hiệu đồng hồ Nhật Bản nổi tiếng với các sản phẩm điện tử và G-Shock'),
  ('Orient', 'Thương hiệu đồng hồ Nhật Bản cao cấp với lịch sử lâu đời'),
  ('Citizen', 'Thương hiệu đồng hồ Nhật Bản tiên phong công nghệ Eco-Drive'),
  ('Seiko', 'Thương hiệu đồng hồ Nhật Bản hàng đầu thế giới'),
  ('Omega', 'Thương hiệu đồng hồ Thụy Sỹ sang trọng và đẳng cấp')
ON CONFLICT (name) DO NOTHING;
