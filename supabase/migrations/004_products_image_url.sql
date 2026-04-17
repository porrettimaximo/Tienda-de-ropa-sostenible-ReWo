-- Add image_url column to products table
alter table public.products 
add column if not exists image_url text;

-- Add comment for clarity
comment on column public.products.image_url is 'URL to the product image (stored in Supabase Storage or external CDN)';
