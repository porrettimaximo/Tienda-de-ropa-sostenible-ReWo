-- Crea un bucket publico para almacenar las imagenes de los productos

insert into storage.buckets (id, name, public) 
values ('products', 'products', true)
on conflict (id) do nothing;

-- Crear politicas de seguridad para permitir el acceso publico de lectura
create policy "Public Access" on storage.objects 
for select using ( bucket_id = 'products' );

-- (Opcional) Si quieres permitir subidas desde el cliente autenticado sin pasar por tu backend:
-- create policy "Auth Insert" on storage.objects for insert with check ( bucket_id = 'products' and auth.role() = 'authenticated' );
