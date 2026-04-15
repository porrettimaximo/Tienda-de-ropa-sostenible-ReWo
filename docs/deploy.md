# Deploy recomendado

## Frontend en Netlify

- Root del proyecto: `apps/web`
- Build command: `npm run build`
- Publish directory: `dist`

## Backend en Render

- Root del servicio: `apps/api`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## Variables de entorno backend

- `APP_NAME`
- `APP_ENV`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## Paso recomendado para Supabase

1. Crear un proyecto nuevo en Supabase.
2. Abrir el SQL Editor.
3. Ejecutar el archivo `supabase/migrations/001_initial_schema.sql`.
4. Verificar que se creen tablas, indices y la vista `sales_by_size_color`.

## Variables sugeridas frontend

- `VITE_API_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
