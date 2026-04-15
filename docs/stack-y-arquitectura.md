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
- Testing sugerido:
  - frontend: `Vitest` + `Testing Library`
  - backend: `Pytest`

## Entidades base

- Usuario
- Cliente
- Producto
- Variante
- Categoria
- Talla
- Color
- Inventario
- Promocion
- Combo
- Proveedor
- Orden
- Item de orden
- Direccion
- Movimiento de puntos

## Endpoints iniciales sugeridos

- `GET /health`
- `GET /products`
- `GET /products/:id`
- `GET /products/:id/variants`
- `POST /auth/login`
- `GET /auth/me`
- `GET /admin/products`
- `POST /admin/products`
- `PUT /admin/products/:id`
- `DELETE /admin/products/:id`
- `POST /admin/variants`
- `POST /sales/store`
- `GET /reports/sales-by-size-color`
- `GET /loyalty/customers/:id`

## Deploy recomendado

- `web` en Netlify
- `api` en Render
- `database`, `auth` y `storage` en Supabase

## Motivo de esta eleccion

Esta combinacion equilibra velocidad de desarrollo, buena experiencia de usuario, facilidad de despliegue y una historia tecnica facil de defender en el video tecnico.

## Modulos funcionales reales del proyecto

- Catalogo con variantes por talla y color
- Stock por variante
- Ventas online
- Registro de ventas en tienda fisica
- Promociones y combos
- Programa de puntos
- Gestion de proveedores eticos
- Reporte de ventas por talla y color
