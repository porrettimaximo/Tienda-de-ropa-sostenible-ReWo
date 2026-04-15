# Arquitectura del backend

## Estilo elegido

Arquitectura por capas:

- `routers`
- `services`
- `repositories`

## Responsabilidades

### Routers

Reciben requests HTTP y delegan la logica a servicios.

### Services

Orquestan casos de uso del dominio:

- auth
- catalogo
- ventas
- reporting

### Repositories

Resuelven el acceso a datos:

- `MemoryRepository`
- `SupabaseRepository`
- `HybridRepository`

## Beneficio

El backend puede cambiar de almacenamiento sin romper endpoints ni servicios.

## Flujo actual

`router -> service -> repository -> memory/supabase`
