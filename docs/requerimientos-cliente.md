# Requerimientos del cliente

## Cliente

`EcoWear Moda Mexico`

## Tipo de proyecto

Tienda de ropa sostenible con operacion mixta:

- ventas online
- ventas en tienda fisica

## Requerimientos funcionales confirmados

- Catalogo con tallas y colores
- Manejo de stock por variante
- Soporte para ventas online y tienda fisica
- Promociones y combos
- Programa de lealtad por puntos
- Gestion o registro de proveedores eticos
- Reporte de ventas por talla y color

## Reglas confirmadas (abril 2026)

- `Combo de temporada`:
  - aplica a todo el catalogo
  - condicion: `2+ productos` y `subtotal >= $5,000 MXN`
  - descuento: `-$350 MXN` fijo
  - vigencia: hasta `30 abril 2026` (ilimitado dentro de la vigencia)
- `Puntos Eco`:
  - acumulacion: `1 punto` por cada `$10 MXN` pagados
  - vencimiento: `12 meses` desde que se generan
  - canje: `500 puntos = $100 MXN` de descuento
  - aplica igual en `online` y `tienda fisica`
- `Tallas estandar`:
  - `XS, S, M, L, XL`
  - ocultar variantes sin stock en navegacion/seleccion
- `Ventas tienda fisica`:
  - obligatorio registrar `sucursal` y `vendedor`
  - metodos de pago: `Efectivo`, `Tarjeta`, `TDD`
  - preguntar si requiere `factura`; si si: pedir `RFC` y `Razon social`
- `Reportes`:
  - filtros: por `fecha` y `canal`
  - KPIs: `Top 5 productos`, `ticket promedio`, `unidades vendidas`
- `Proveedores`:
  - uso interno (admin)
  - campos: `Nombre`, `Pais`, `Certificacion organica`, `Materiales`

## Decisiones de experiencia y contenido ya definidas

Estas decisiones ya quedaron reflejadas en la propuesta visual inicial del frontend y conviene tratarlas como parte del alcance esperado:

- `Promociones y lealtad`:
  - banner destacado para `Combos de Temporada`
  - seccion dedicada al `Programa de Lealtad (Puntos Eco)`
  - objetivo: fomentar retencion y recompra
- `Transparencia de marca`:
  - seccion dedicada a `Proveedores Eticos`
  - objetivo: comunicar el valor sostenible y la trazabilidad de la marca

## Implicancias tecnicas

### 1. Catalogo con variantes

El producto no puede modelarse solo como una prenda simple.

Se necesitan al menos:

- Producto
- Variante de producto
- Talla
- Color
- Stock por variante

Ejemplo:

- Producto: Camiseta Basica
- Variante 1: talle M, color verde, stock 8
- Variante 2: talle L, color beige, stock 3

### 2. Ventas online y tienda fisica

El sistema debe distinguir el canal de venta para poder reportar y operar correctamente.

Se recomienda que cada orden tenga:

- `sales_channel`: `online` o `store`
- fecha
- items
- totales
- puntos generados

### 3. Promociones y combos

Debe existir algun mecanismo para:

- descuentos por porcentaje o monto fijo
- promociones activas por fecha
- combos de multiples productos

### 4. Programa de lealtad

Se necesita un modelo de cliente con acumulacion de puntos.

Campos base sugeridos:

- nombre
- email o identificador
- puntos acumulados
- historial de movimientos de puntos

### 5. Proveedores eticos

No necesariamente implica un portal completo, pero si un modulo o registro administrable.

Campos sugeridos:

- nombre del proveedor
- pais o region
- certificacion o respaldo etico
- materiales asociados
- observaciones

### 6. Reporte por talla y color

Este requerimiento obliga a guardar cada venta con su variante exacta.

El reporte deberia poder responder:

- que tallas se venden mas
- que colores se venden mas
- que combinaciones talla/color tienen mejor salida
- si hay diferencias entre canal online y fisico

## MVP recomendado

- Home
- Catalogo con filtros
- Detalle de producto con seleccion de talla y color
- Carrito
- Checkout basico
- Login admin
- Panel admin de productos y variantes
- Registro simple de ventas en tienda fisica
- Promociones basicas
- Lealtad por puntos
- Reporte simple por talla y color

## Dudas utiles para confirmar por email

- Confirmar si el campo `TDD` refiere a `tarjeta de debito` o algun metodo especifico del negocio
- Confirmar formato esperado de `RFC` y si hay validacion estricta o solo captura
- Confirmar si el vencimiento de puntos es exacto a `365 dias` o a `mes calendario`
- Confirmar si el combo se evalua por `productos distintos` (slug) o por `cantidad total de items`
