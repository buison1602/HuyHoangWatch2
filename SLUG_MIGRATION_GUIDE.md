# Hướng Dẫn Chuyển Đổi URL từ ID sang Slug

## Bước 1: Chạy Migration Thêm Cột Slug

1. Mở **Supabase Dashboard**
2. Vào **SQL Editor**
3. Mở file `scripts/006_add_slug_to_products.sql`
4. Copy nội dung và chạy trong SQL Editor

```sql
-- Migration: Add slug column to products table

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS slug TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique ON products(slug);

COMMENT ON COLUMN products.slug IS 'SEO-friendly URL slug for the product';
```

## Bước 2: Generate Slug Cho Products Hiện Có

1. Mở file `scripts/007_generate_product_slugs.sql`
2. Copy nội dung và chạy trong SQL Editor

```sql
-- Tạo function generate slug
CREATE OR REPLACE FUNCTION generate_slug(text_input TEXT) 
RETURNS TEXT AS $$
...
$$ LANGUAGE plpgsql;

-- Update products với slugs
UPDATE products
SET slug = generate_slug(name) || '-' || SUBSTRING(id::TEXT, 1, 8)
WHERE slug IS NULL OR slug = '';

-- Verify kết quả
SELECT id, name, slug FROM products LIMIT 10;
```

## Bước 3: Xóa Thư Mục Cũ

Sau khi đã tạo thư mục mới `[slug]`, xóa thư mục cũ:

```powershell
Remove-Item -Recurse -Force "d:\Work\HuyHoangWatch2\app\shop\product\[id]"
```

## Bước 4: Test

1. Restart dev server:
```bash
npm run dev
```

2. Kiểm tra URL mới:
- Trước: `http://localhost:3000/shop/product/0b8d1a13-915f-4fda-a80a-b5f1e37855ce`
- Sau: `http://localhost:3000/shop/product/dong-ho-rolex-0b8d1a13`

## Kết Quả

✅ URL thân thiện với SEO
✅ Có từ khóa trong URL
✅ Không dấu, không khoảng trắng
✅ Ngắn gọn, dễ nhớ
✅ Auto-generate khi tạo/edit sản phẩm mới

## Lưu Ý

- Slug được tự động generate khi tạo/sửa sản phẩm
- Slug là duy nhất (unique constraint)
- Fallback về ID nếu slug chưa có
- Ví dụ slug: "dong-ho-nam-cao-cap", "day-deo-da-that"
