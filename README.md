# ReWo - Tienda de ropa sostenible

Base inicial para desarrollar la prueba tecnica de pasantia de ReWo con un stack liviano, rapido de implementar y facil de desplegar gratis.

## Stack final elegido

- Frontend: `React` + `Vite` + `TypeScript`
- UI: `Tailwind CSS`
- Backend API: `Python` + `FastAPI`
- Base de datos: `Supabase Postgres`
- Auth: `Supabase Auth`
- Storage opcional: `Supabase Storage`
- Deploy:
  - `web`: `Netlify`
  - `api`: `Render`
  - `db/auth/storage`: `Supabase`

## Por que este stack

- `React + Vite` permite construir pantallas rapido y despues replicar visualmente el estilo que definas.
- `FastAPI` da velocidad de desarrollo, validacion fuerte y documentacion automatica.
- `Supabase` evita montar auth y base de datos desde cero.
- `Netlify + Render + Supabase` encaja bien con planes gratuitos y herramientas que ya usas.

## Arquitectura inicial

- `apps/web`: interfaz del ecommerce
- `apps/api`: API REST y logica del negocio
- `docs`: requerimientos, checklist, decisiones tecnicas y entregables

## Alcance funcional sugerido para el MVP

- Landing / home
- Catalogo de productos
- Detalle de producto con talla y color
- Carrito
- Checkout basico
- Login admin
- Panel admin simple para productos, variantes y stock
- Registro de ventas en tienda fisica
- Promociones basicas y combos
- Programa de lealtad por puntos
- Proveedores eticos
- Reporte de ventas por talla y color

## Decisiones visuales y de contenido ya incorporadas

- Banner promocional para `Combos de Temporada`
- Seccion de `Programa de Lealtad` con `Puntos Eco`
- Seccion de `Proveedores Eticos` enfocada en transparencia de marca
- Flujo de autenticacion diferenciado para `cliente` y `admin`

## Pantallas ya definidas

- Inicio
- Coleccion
- Detalle de producto
- Bolsa
- Checkout
- Login cliente
- Mi cuenta
- Login admin
- Panel admin

## Conexion actual del frontend

- Catalogo y detalle preparados para leer desde API
- Login cliente y admin con flujo navegable
- Mi cuenta y panel admin preparados para consumir endpoints reales
- Fallback local activo mientras se configura backend/Supabase

## Funcionalidad extra sugerida

`Modulo de impacto sostenible`

- Mostrar materiales sostenibles por producto
- Comunicar ahorro o impacto positivo
- Reforzar la propuesta de valor de la marca

## Entregables exigidos por la prueba

- App funcional y desplegada publicamente
- Repositorio Git con historial completo
- `README.md` con arquitectura, setup, endpoints y decisiones tecnicas
- 2 videos Loom
- Funcionalidad extra documentada

## Estructura del repo

```text
.
|-- apps/
|   |-- api/
|   `-- web/
|-- docs/
`-- package.json
```

## Proximo paso recomendado

1. Modelar entidades reales del negocio en Supabase.
2. Crear la primera pantalla visual.
3. Replicar ese lenguaje visual en el resto del flujo.
4. Conectar frontend, backend y Supabase.
