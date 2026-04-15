# Cobertura de requerimientos

## Estado actual

El frontend ya cubre visualmente la mayor parte del brief, pero no todos los módulos están conectados todavía a datos reales.

## Mapa requerimiento -> pantallas

### 1. Catalogo tallas/colores con stock por variantes

Pantallas que lo cubren:

- `Colección` `/collections`
- `Detalle de producto` `/products/:slug`
- `Admin catálogo y variantes` `/admin/catalog`

Estado:

- `visual`: cubierto
- `funcional real`: pendiente de conectar a Supabase y stock real

### 2. Ventas online y tienda física

Pantallas que lo cubren:

- `Bolsa` `/cart`
- `Checkout` `/checkout`
- `Venta tienda física` `/admin/store-sales`

Estado:

- `online visual`: cubierto
- `tienda física visual`: cubierto
- `registro real de ventas`: pendiente

### 3. Promociones y combos

Pantallas que lo cubren:

- `Inicio` `/`
- `Checkout` `/checkout`
- `Panel admin` `/admin`

Estado:

- `visual/editorial`: cubierto
- `gestión real de promociones`: pendiente

### 4. Programa lealtad por puntos

Pantallas que lo cubren:

- `Inicio` `/`
- `Login cliente` `/login`
- `Mi cuenta` `/account`

Estado:

- `flujo visual`: cubierto
- `cálculo y persistencia real de puntos`: pendiente

### 5. Proveedores éticos

Pantallas que lo cubren:

- `Inicio` `/`
- `Panel admin` `/admin`

Estado:

- `transparencia visual`: cubierto
- `gestión real de proveedores`: pendiente

### 6. Reporte ventas por talla/color

Pantallas que lo cubren:

- `Panel admin` `/admin`

Estado:

- `vista inicial`: cubierto
- `reporte real con consultas`: pendiente

## Conclusión

El proyecto ya tiene las pantallas base para representar todos los requerimientos del cliente.

Lo que falta ahora no es tanto inventar más vistas, sino:

- conectar datos reales
- persistir operaciones
- manejar autenticación real
- calcular reportes, stock y puntos desde backend + Supabase
