# API

Backend del ecommerce de ReWo.

## Stack sugerido

- `Python`
- `FastAPI`
- `Pydantic`
- `Supabase`

## Modulos sugeridos

- Auth
- Products
- Categories
- Cart
- Orders
- Inventory

## Endpoints disponibles hoy

- `GET /`
- `GET /health`
- `POST /auth/login/client`
- `POST /auth/login/admin`
- `GET /products`
- `GET /products/{slug}`
- `GET /products/{slug}/variants`
- `POST /checkout`
- `POST /sales/store`
- `GET /admin/products`
- `POST /admin/products`
- `PUT /admin/products/{slug}`
- `POST /admin/products/{slug}/variants`
- `PUT /admin/products/{slug}/variants/{variant_id}`
- `GET /loyalty/customers/{id}`
- `GET /reports/sales-by-size-color`
- `GET /reports/overview`

## Correr en local

Desde la raiz del proyecto:

```powershell
npm run dev:api
```

O desde `apps/api`:

```powershell
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## Estado actual

- La API ya responde con el mismo catalogo base que usa el frontend
- Ya permite login demo, checkout online, venta de tienda fisica y administracion basica de catalogo
- La siguiente integracion natural es reemplazar el almacenamiento en memoria por Supabase real
