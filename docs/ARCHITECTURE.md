# 🏗️ Arquitectura y Endpoints - ReWo

Este documento describe la infraestructura técnica, el flujo de datos y los puntos de enlace (endpoints) que sostienen la plataforma ReWo.

---

## 🏛️ Arquitectura del Sistema

El sistema utiliza un diseño de **Arquitectura en Capas (Layered Architecture)** para garantizar el desacoplamiento, la escalabilidad y la facilidad de mantenimiento.

### 1. Capas del Backend (FastAPI)
*   **Routers (Controladores):** Gestionan las peticiones HTTP, validan los parámetros de entrada y definen la interfaz de la API.
*   **Services (Lógica de Negocio):** Orquestan los procesos complejos, como el cálculo del motor de promociones o la lógica de puntos de lealtad.
*   **Repositories (Acceso a Datos):** Capa de abstracción que interactúa directamente con Supabase (PostgreSQL). Utiliza una interfaz (Protocol) para permitir el intercambio de proveedores de datos si fuera necesario.

### 2. Flujo de Datos
1.  El **Frontend (React)** realiza peticiones asíncronas vía HTTPS.
2.  El **Backend (FastAPI)** valida la sesión mediante JWT y procesa la solicitud.
3.  Los **Services** ejecutan las reglas de negocio aplicables.
4.  El **Repository** persiste o recupera la información de **Supabase**.

---

## 📡 Catálogo de Endpoints (API)

### Autenticación y Perfil
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/auth/register` | Crea un nuevo cliente en el sistema. |
| `POST` | `/auth/login` | Valida credenciales y retorna un token JWT + Rol. |
| `GET` | `/customers/account` | Retorna los puntos eco y el historial del cliente logueado. |

### Catálogo y Ventas (Público/Cliente)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/products` | Lista todos los productos activos con sus variantes. |
| `GET` | `/products/{slug}` | Detalle completo de un producto específico. |
| `GET` | `/promotions` | Retorna los combos y promociones vigentes. |
| `POST` | `/checkout` | Procesa la compra, calcula descuentos y asigna puntos. |

### Administración (Privado)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/admin/summary` | Estadísticas generales (Total productos, promos activas). |
| `GET` | `/admin/sales-kpis` | Métricas de ventas filtrables por fecha y canal. |
| `GET` | `/admin/sales-report` | Reporte detallado de unidades por variante (Talla/Color). |
| `POST` | `/admin/store-sale` | Registra una venta realizada en la tienda física. |
| `POST` | `/admin/products` | Creación de nuevos productos en el catálogo. |
| `DELETE` | `/admin/products/{id}` | Desactivación (Soft Delete) de productos. |

---

## 🛠️ Stack Tecnológico Detallado
*   **Frontend:** React 18, Vite (Build Tool), Tailwind CSS (Estilos), React Router 6.
*   **Backend:** FastAPI (Python 3.12), Pydantic (Validación de Esquemas).
*   **Infraestructura:** Supabase (PostgreSQL, Auth, Storage).
*   **Estándares:** RESTful API, JSON, JWT, Mobile-first Design.
