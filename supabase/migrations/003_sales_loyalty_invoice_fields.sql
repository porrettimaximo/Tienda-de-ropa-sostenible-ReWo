-- Venta tienda / factura / promos+lealtad separadas

alter table if exists public.orders
add column if not exists promotion_discount_total numeric(10,2) not null default 0 check (promotion_discount_total >= 0);

alter table if exists public.orders
add column if not exists loyalty_discount_total numeric(10,2) not null default 0 check (loyalty_discount_total >= 0);

alter table if exists public.orders
add column if not exists redeemed_points integer not null default 0 check (redeemed_points >= 0);

alter table if exists public.orders
add column if not exists payment_method text;

alter table if exists public.orders
add column if not exists store_name text;

alter table if exists public.orders
add column if not exists seller text;

alter table if exists public.orders
add column if not exists invoice_required boolean;

alter table if exists public.orders
add column if not exists invoice_rfc text;

alter table if exists public.orders
add column if not exists invoice_business_name text;

update public.orders
set promotion_discount_total = coalesce(discount_total, 0)
where promotion_discount_total = 0;

alter table if exists public.loyalty_movements
add column if not exists expires_at timestamptz;

create index if not exists idx_orders_created_at on public.orders(created_at);

