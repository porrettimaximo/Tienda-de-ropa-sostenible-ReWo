create extension if not exists "pgcrypto";

create table if not exists public.customers (
    id uuid primary key default gen_random_uuid(),
    full_name text not null,
    email text unique,
    phone text,
    loyalty_points integer not null default 0,
    created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.suppliers (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    country text,
    ethical_certification text,
    materials text[] not null default '{}',
    notes text,
    created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.categories (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    slug text not null unique,
    created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    category_id uuid references public.categories(id) on delete set null,
    supplier_id uuid references public.suppliers(id) on delete set null,
    name text not null,
    slug text not null unique,
    description text,
    base_price numeric(10,2) not null check (base_price >= 0),
    is_active boolean not null default true,
    sustainability_label text,
    sustainability_score integer check (sustainability_score between 0 and 100),
    created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_variants (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references public.products(id) on delete cascade,
    sku text not null unique,
    size text not null,
    color text not null,
    stock integer not null default 0 check (stock >= 0),
    price_override numeric(10,2) check (price_override >= 0),
    is_active boolean not null default true,
    created_at timestamptz not null default timezone('utc', now()),
    unique(product_id, size, color)
);

create table if not exists public.promotions (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    promotion_type text not null check (promotion_type in ('percentage', 'fixed', 'combo')),
    discount_value numeric(10,2) not null default 0 check (discount_value >= 0),
    starts_at timestamptz,
    ends_at timestamptz,
    is_active boolean not null default true,
    created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.promotion_products (
    id uuid primary key default gen_random_uuid(),
    promotion_id uuid not null references public.promotions(id) on delete cascade,
    product_id uuid not null references public.products(id) on delete cascade,
    quantity integer not null default 1 check (quantity > 0),
    role text not null default 'eligible' check (role in ('eligible', 'bundle_item'))
);

create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    customer_id uuid references public.customers(id) on delete set null,
    sales_channel text not null check (sales_channel in ('online', 'store')),
    status text not null default 'pending' check (status in ('pending', 'paid', 'completed', 'cancelled')),
    subtotal numeric(10,2) not null check (subtotal >= 0),
    discount_total numeric(10,2) not null default 0 check (discount_total >= 0),
    total numeric(10,2) not null check (total >= 0),
    loyalty_points_earned integer not null default 0 check (loyalty_points_earned >= 0),
    notes text,
    created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.orders(id) on delete cascade,
    product_id uuid not null references public.products(id) on delete restrict,
    variant_id uuid not null references public.product_variants(id) on delete restrict,
    quantity integer not null check (quantity > 0),
    unit_price numeric(10,2) not null check (unit_price >= 0),
    total_price numeric(10,2) not null check (total_price >= 0)
);

create table if not exists public.loyalty_movements (
    id uuid primary key default gen_random_uuid(),
    customer_id uuid not null references public.customers(id) on delete cascade,
    order_id uuid references public.orders(id) on delete set null,
    movement_type text not null check (movement_type in ('earn', 'redeem', 'adjustment')),
    points integer not null,
    reason text,
    created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_supplier_id on public.products(supplier_id);
create index if not exists idx_variants_product_id on public.product_variants(product_id);
create index if not exists idx_orders_customer_id on public.orders(customer_id);
create index if not exists idx_orders_sales_channel on public.orders(sales_channel);
create index if not exists idx_order_items_variant_id on public.order_items(variant_id);
create index if not exists idx_loyalty_customer_id on public.loyalty_movements(customer_id);

create or replace view public.sales_by_size_color as
select
    pv.size,
    pv.color,
    o.sales_channel,
    sum(oi.quantity) as total_units,
    sum(oi.total_price) as total_revenue
from public.order_items oi
join public.orders o on o.id = oi.order_id
join public.product_variants pv on pv.id = oi.variant_id
where o.status in ('paid', 'completed')
group by pv.size, pv.color, o.sales_channel;
