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

- El cliente quiere pagos reales o checkout simulado
- La tienda fisica necesita caja completa o solo registro manual de ventas
- Los puntos se canjean o solo se acumulan
- Los combos afectan stock de variantes individuales
- Los reportes necesitan exportacion o solo vista en dashboard
