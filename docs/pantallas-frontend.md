# Pantallas del frontend

## Objetivo

Definir las vistas principales del ecommerce y como se conectan entre si.

## Flujo cliente

- `Inicio` `/`
  - entrada editorial a la marca
  - presenta coleccion, combos, puntos eco y proveedores eticos
- `Coleccion` `/collections`
  - catalogo visual con filtros editoriales
  - conecta a detalle de producto
- `Detalle de producto` `/products/:slug`
  - muestra narrativa, composicion, sostenibilidad, colores y tallas
  - conecta a bolsa y checkout
- `Bolsa` `/cart`
  - resumen de seleccion actual
  - conecta a checkout
- `Checkout` `/checkout`
  - formulario de compra
- `Login cliente` `/login`
  - acceso para puntos eco e historial
- `Mi cuenta` `/account`
  - resumen de perfil, nivel, puntos y beneficios

- `Combos` `/combos`
  - detalle de promo activa y guia rapida para aplicarla

## Flujo admin

- `Admin promociones` `/admin/promotions`
  - alta/edicion de promos (combo/fijo/porcentaje)
- `Admin proveedores` `/admin/suppliers`
  - registro interno de proveedores (pais/certificacion/materiales)

- `Login admin` `/admin/login`
  - acceso interno de operacion
- `Panel admin` `/admin`
  - resumen de stock, promociones, proveedores y reporte rapido
- `Admin catálogo` `/admin/catalog`
  - gestion visual de productos, composicion y variantes
- `Venta tienda física` `/admin/store-sales`
  - registro visual de ventas de mostrador

## Principios visuales

- estilo editorial y monolitico
- tipografia dominante en mayusculas y tracking amplio
- bloques amplios con imagen protagonista
- tonos neutros, verdes apagados y acentos tierra
- mezcla de lujo sobrio con narrativa de sostenibilidad

## Estado actual

Estas pantallas ya estan scaffolded en el frontend con navegacion real:

- `HomePage`
- `CollectionPage`
- `ProductDetailPage`
- `CartPage`
- `CheckoutPage`
- `LoginPage`
- `AccountPage`
- `AdminLoginPage`
- `AdminDashboardPage`
- `AdminCatalogPage`
- `StoreSalePage`
- `CombosPage`
- `AdminPromotionsPage`
- `AdminSuppliersPage`
