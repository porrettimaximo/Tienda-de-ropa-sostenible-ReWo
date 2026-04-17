# Stack y arquitectura recomendada

## Lenguajes

- `TypeScript` para frontend
- `Python` para backend
- `SQL` para consultas y modelado de datos

## Frameworks y herramientas

- Frontend: `React` + `Vite`
- Backend: `FastAPI`
- Base de datos: `Supabase Postgres`
- Auth: `Supabase Auth`
- Cliente DB/Auth: `supabase-py`
- UI: `Tailwind CSS`
- Validacion: `Zod`
- Testing:
  - frontend: `Vitest` + `Testing Library`
  - backend: `Pytest`

## Entidades base

- Usuario
- Producto
- Categoria
- Variante
- Orden
- Item de orden
- Direccion

## Endpoints iniciales sugeridos

- `GET /health`
- `GET /products`
- `GET /products/:id`
- `POST /auth/login`
- `GET /auth/me`
- `GET /admin/products`
- `POST /admin/products`
- `PUT /admin/products/:id`
- `DELETE /admin/products/:id`

## Deploy recomendado

- `web` en Netlify
- `api` en Render
- `database`, `auth` y `storage` en Supabase

## Motivo de esta eleccion

Esta combinacion equilibra velocidad de desarrollo, buena experiencia de usuario, facilidad de despliegue y una historia tecnica facil de defender en el video tecnico.
