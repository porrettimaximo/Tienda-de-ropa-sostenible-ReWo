# Web

Frontend del ecommerce de ReWo.

## Stack sugerido

- `React`
- `Vite`
- `TypeScript`
- `Tailwind CSS`

## Pantallas sugeridas

- Home
- Catalogo
- Detalle de producto
- Carrito
- Checkout
- Login admin
- Dashboard admin

## Variables de entorno

- `VITE_API_URL`: URL base del backend FastAPI

## Correr en local

Desde la raiz del proyecto:

```powershell
npm run dev:web
```

O desde `apps/web`:

```powershell
npm run dev
```

## Estado actual

- Las pantallas ya consumen una capa de datos compartida.
- Si el backend no responde, el frontend usa datos demo locales.
- Esto permite avanzar visualmente sin bloquear el desarrollo.
