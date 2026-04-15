# Autenticacion y roles

## Decision tomada

El ecommerce tendra dos accesos diferenciados:

- `cliente`
- `admin`

## Cliente

Objetivo:

- revisar historial
- ver puntos eco
- consultar beneficios
- facilitar recompra

Pantallas asociadas:

- `/login`
- `/account`

## Admin

Objetivo:

- gestionar productos
- gestionar variantes y stock
- administrar promociones
- revisar proveedores eticos
- ver reportes y ventas

Pantallas asociadas:

- `/admin/login`
- `/admin`

## Implementacion recomendada

- `Supabase Auth` para login y sesiones
- perfiles en tabla separada para distinguir roles
- validacion de acceso por rol en frontend y backend

## Estado actual

Ya existen las pantallas base del flujo de autenticacion:

- `LoginPage`
- `AccountPage`
- `AdminLoginPage`
- `AdminDashboardPage`

Por ahora funcionan como flujo visual y navegable con datos demo.
