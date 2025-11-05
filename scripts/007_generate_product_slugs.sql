-- Script to generate slugs for existing products
-- Run this AFTER adding the slug column

-- Function to convert Vietnamese to slug (simplified SQL version)
CREATE OR REPLACE FUNCTION generate_slug(text_input TEXT) 
RETURNS TEXT AS $$
DECLARE
  result TEXT;
BEGIN
  result := LOWER(text_input);
  
  -- Replace Vietnamese characters
  result := TRANSLATE(result, 
    'áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ',
    'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd'
  );
  
  -- Remove special characters, keep only alphanumeric and spaces
  result := REGEXP_REPLACE(result, '[^a-z0-9\s-]', '', 'g');
  
  -- Replace spaces with hyphens
  result := REGEXP_REPLACE(result, '\s+', '-', 'g');
  
  -- Replace multiple hyphens with single hyphen
  result := REGEXP_REPLACE(result, '-+', '-', 'g');
  
  -- Trim hyphens from start and end
  result := TRIM(BOTH '-' FROM result);
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Update products with generated slugs
UPDATE products
SET slug = generate_slug(name) || '-' || SUBSTRING(id::TEXT, 1, 8)
WHERE slug IS NULL OR slug = '';

-- Verify
SELECT id, name, slug FROM products LIMIT 10;
