# Modelo de datos inicial

## Objetivo

Este modelo esta pensado para cubrir el brief real de `EcoWear Moda Mexico` sin sobreconstruir la primera version.

## Entidades principales

- `customers`: clientes y puntos acumulados
- `suppliers`: proveedores eticos
- `categories`: categorias de productos
- `products`: informacion general del producto
- `product_variants`: stock por talla y color
- `promotions`: descuentos o combos
- `promotion_products`: productos incluidos en una promocion o combo
- `orders`: ventas online o de tienda fisica
- `order_items`: items vendidos por variante
- `loyalty_movements`: historial de puntos

## Reglas clave

- El stock vive en `product_variants`, no en `products`
- Cada venta debe guardar la `variant_id` exacta
- El canal de venta se guarda en `orders.sales_channel`
- Los reportes de talla y color salen desde `order_items + product_variants`
- Los combos y promociones comparten tabla base para simplificar el MVP

## Flujo de negocio resumido

1. Se crea un producto.
2. Se crean sus variantes por talla y color.
3. Cada variante tiene stock propio.
4. Al vender, se registra una orden y sus items.
5. Cada item referencia la variante vendida.
6. La orden puede sumar puntos al cliente.
7. Los reportes salen de ventas reales, no de catalogo.

## Archivo fuente

El esquema SQL inicial esta en:

- [001_initial_schema.sql](<c:\Users\Maxi\Desktop\Tienda de ropa sostenible ReWo\supabase\migrations\001_initial_schema.sql>)
