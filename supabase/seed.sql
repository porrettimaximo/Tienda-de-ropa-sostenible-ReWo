insert into public.categories (id, name, slug)
values
  ('11111111-1111-1111-1111-111111111111', 'Coleccion Permanente', 'coleccion-permanente'),
  ('22222222-2222-2222-2222-222222222222', 'Accesorios', 'accesorios')
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug;

insert into public.suppliers (id, name, country, ethical_certification, materials, notes)
values
  (
    '33333333-3333-3333-3333-333333333333',
    'Comunidades Oaxaquenas',
    'Mexico',
    'Tejido artesanal certificado',
    array['lino', 'algodon organico'],
    'Proveedor artesanal para linea editorial'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Bio-Tech Queretaro',
    'Mexico',
    'Fibras recicladas de bajo impacto',
    array['reciclados', 'mezclas tecnicas'],
    'Proveedor tecnico para linea de volumen y accesorios'
  )
on conflict (id) do update set
  name = excluded.name,
  country = excluded.country,
  ethical_certification = excluded.ethical_certification,
  materials = excluded.materials,
  notes = excluded.notes;

insert into public.customers (id, full_name, email, phone, loyalty_points)
values
  (
    '55555555-5555-5555-5555-555555555555',
    'Maria Fernandez',
    'maria@ecowear.mx',
    '+52 55 0000 0001',
    1280
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'Juan Lopez',
    'juan@ecowear.mx',
    '+52 55 0000 0002',
    420
  )
on conflict (id) do update set
  full_name = excluded.full_name,
  email = excluded.email,
  phone = excluded.phone,
  loyalty_points = excluded.loyalty_points;

insert into public.products (
  id, category_id, supplier_id, name, slug, description, base_price,
  is_active, sustainability_label, sustainability_score
)
values
  (
    '77777777-7777-7777-7777-777777777771',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    'Tunica Ancestral Lino',
    'tunica-ancestral-lino',
    'Silueta amplia en lino premium con acabado lavado y teñido artesanal para una caida ligera y arquitectonica.',
    3450,
    true,
    'Impacto bajo / teñido natural',
    94
  ),
  (
    '77777777-7777-7777-7777-777777777772',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444444',
    'Pantalon Canamo Estructural',
    'pantalon-canamo-estructural',
    'Pantalon de cañamo con estructura relajada, cintura alta y construccion duradera para uso diario.',
    2800,
    true,
    'Fibra regenerativa',
    91
  ),
  (
    '77777777-7777-7777-7777-777777777773',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    'Camisa Algodon Crudo',
    'camisa-algodon-crudo',
    'Camisa estructurada en algodon organico crudo con cuello limpio y textura visible de alta calidad.',
    1950,
    true,
    'Algodon organico certificado',
    90
  ),
  (
    '77777777-7777-7777-7777-777777777774',
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444444',
    'Chaleco Reciclado Sage',
    'chaleco-reciclado-sage',
    'Chaleco sin mangas con cuerpo suave, color terroso y confeccion pensada para combinar capas.',
    2200,
    true,
    'Lana reciclada posconsumo',
    88
  ),
  (
    '77777777-7777-7777-7777-777777777775',
    '22222222-2222-2222-2222-222222222222',
    '44444444-4444-4444-4444-444444444444',
    'Bolso Piel de Nopal',
    'bolso-piel-de-nopal',
    'Bolso estructurado con acabado mate y herrajes discretos, hecho en material vegetal de nopal.',
    4100,
    true,
    'Alternativa vegetal al cuero',
    93
  ),
  (
    '77777777-7777-7777-7777-777777777776',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    'T-Shirt Carbon Organico',
    'tshirt-carbon-organico',
    'Playera de algodon organico de tacto firme, cuello compacto y estetica sobria para rotacion permanente.',
    850,
    true,
    'Basico durable / menor recambio',
    87
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    'Capa Lino Asimetrica',
    'capa-lino-asimetrica',
    'Capa asimetrica de lino con vuelo suave y caida limpia para looks de transicion entre estaciones.',
    2900,
    true,
    'Lino de bajo impacto',
    89
  )
on conflict (id) do update set
  category_id = excluded.category_id,
  supplier_id = excluded.supplier_id,
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  base_price = excluded.base_price,
  is_active = excluded.is_active,
  sustainability_label = excluded.sustainability_label,
  sustainability_score = excluded.sustainability_score;

insert into public.product_variants (
  id, product_id, sku, size, color, stock, price_override, is_active
)
values
  ('88888888-8888-8888-8888-888888888801', '77777777-7777-7777-7777-777777777771', 'TUNICA-S-ARENA', 'S', 'Arena', 6, 3450, true),
  ('88888888-8888-8888-8888-888888888802', '77777777-7777-7777-7777-777777777771', 'TUNICA-M-MUSGO', 'M', 'Musgo', 4, 3450, true),
  ('88888888-8888-8888-8888-888888888803', '77777777-7777-7777-7777-777777777771', 'TUNICA-L-TERRACOTA', 'L', 'Terracota', 3, 3450, true),
  ('88888888-8888-8888-8888-888888888804', '77777777-7777-7777-7777-777777777772', 'PANT-S-GRAFITO', 'S', 'Grafito', 8, 2800, true),
  ('88888888-8888-8888-8888-888888888805', '77777777-7777-7777-7777-777777777772', 'PANT-M-ARCILLA', 'M', 'Arcilla', 6, 2800, true),
  ('88888888-8888-8888-8888-888888888806', '77777777-7777-7777-7777-777777777772', 'PANT-XL-GRAFITO', 'XL', 'Grafito', 2, 2950, true),
  ('88888888-8888-8888-8888-888888888807', '77777777-7777-7777-7777-777777777773', 'CAMISA-S-CRUDO', 'S', 'Crudo', 7, 1950, true),
  ('88888888-8888-8888-8888-888888888808', '77777777-7777-7777-7777-777777777773', 'CAMISA-M-MARFIL', 'M', 'Marfil', 5, 1950, true),
  ('88888888-8888-8888-8888-888888888809', '77777777-7777-7777-7777-777777777773', 'CAMISA-L-CRUDO', 'L', 'Crudo', 4, 1950, true),
  ('88888888-8888-8888-8888-888888888810', '77777777-7777-7777-7777-777777777774', 'CHALECO-M-SAGE', 'M', 'Sage', 4, 2200, true),
  ('88888888-8888-8888-8888-888888888811', '77777777-7777-7777-7777-777777777774', 'CHALECO-L-TIERRA', 'L', 'Tierra', 3, 2200, true),
  ('88888888-8888-8888-8888-888888888812', '77777777-7777-7777-7777-777777777775', 'BOLSO-U-NEGRO', 'Unica', 'Negro', 5, 4100, true),
  ('88888888-8888-8888-8888-888888888813', '77777777-7777-7777-7777-777777777775', 'BOLSO-U-TIERRA', 'Unica', 'Tierra', 2, 4100, true),
  ('88888888-8888-8888-8888-888888888814', '77777777-7777-7777-7777-777777777776', 'TSHIRT-S-CARBON', 'S', 'Carbon', 12, 850, true),
  ('88888888-8888-8888-8888-888888888815', '77777777-7777-7777-7777-777777777776', 'TSHIRT-M-HUESO', 'M', 'Hueso', 10, 850, true),
  ('88888888-8888-8888-8888-888888888816', '77777777-7777-7777-7777-777777777776', 'TSHIRT-L-CARBON', 'L', 'Carbon', 6, 850, true),
  ('88888888-8888-8888-8888-888888888817', '77777777-7777-7777-7777-777777777776', 'TSHIRT-XL-HUESO', 'XL', 'Hueso', 4, 850, true),
  ('88888888-8888-8888-8888-888888888818', '77777777-7777-7777-7777-777777777777', 'CAPA-M-BONE', 'M', 'Bone', 4, 2900, true),
  ('88888888-8888-8888-8888-888888888819', '77777777-7777-7777-7777-777777777777', 'CAPA-L-ARENA', 'L', 'Arena', 3, 2900, true)
on conflict (id) do update set
  product_id = excluded.product_id,
  sku = excluded.sku,
  size = excluded.size,
  color = excluded.color,
  stock = excluded.stock,
  price_override = excluded.price_override,
  is_active = excluded.is_active;

insert into public.promotions (id, name, description, promotion_type, discount_value, is_active)
values
  (
    '99999999-9999-9999-9999-999999999999',
    'Combo de temporada',
    '-$350 MXN en compras desde $5,000 con 2 productos distintos.',
    'combo',
    350,
    true
  )
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  promotion_type = excluded.promotion_type,
  discount_value = excluded.discount_value,
  is_active = excluded.is_active;
