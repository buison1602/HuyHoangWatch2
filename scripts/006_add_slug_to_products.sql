-- Migration: Add slug column to products table
-- Run this in Supabase SQL Editor

-- Add slug column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique ON products(slug);

-- Add comment
COMMENT ON COLUMN products.slug IS 'SEO-friendly URL slug for the product';
