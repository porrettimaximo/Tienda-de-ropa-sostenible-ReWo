-- Add image_url to product_variants
alter table if exists public.product_variants
add column if not exists image_url text;
