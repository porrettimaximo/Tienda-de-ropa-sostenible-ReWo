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

## Variables sugeridas frontend

- `VITE_API_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
