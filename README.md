# 🌿 ReWo - Tienda de Ropa Sostenible

**ReWo** es una plataforma de e-commerce de alto impacto diseñada para marcas de moda ética y circular. Combina una experiencia de usuario premium con una infraestructura robusta para gestionar catálogos sostenibles, programas de lealtad y operaciones comerciales complejas.

---

## 🏗️ Arquitectura del Sistema

El proyecto está estructurado como un **Monorepo** moderno que separa claramente las responsabilidades:

### 1. Frontend (`frontend`)
*   **Tecnologías:** React 18, Vite, TypeScript, Tailwind CSS.
*   **Patrón:** Component-based Architecture con hooks personalizados para gestión de estado (Carrito, Autenticación).
*   **Características:** Mobile-first, 100% responsive, soporte PWA, animaciones fluidas y diseño orientado a conversión.

### 2. Backend (`backend`)
*   **Tecnologías:** FastAPI (Python), Pydantic, SQLAlchemy/PostgreSQL (vía Supabase).
*   **Arquitectura:** Layered Architecture (Routers -> Services -> Repositories).
*   **Seguridad:** Autenticación JWT y control de acceso basado en roles (Admin/Client).

### 3. Base de Datos & Infraestructura (`Supabase`)
*   **Persistencia:** PostgreSQL gestionado.
*   **Auth:** Manejo de sesiones y usuarios.
*   **Storage:** Gestión de imágenes de productos y banners.

---

## 🛠️ Setup e Instalación

### Prerrequisitos
*   Node.js (v18+)
*   Python (3.12+)
*   Docker (opcional para Supabase local)

### Pasos
1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/porrettimaximo/Tienda-de-ropa-sostenible-ReWo.git
    cd "Tienda de ropa sostenible ReWo"
    ```

2.  **Instalar dependencias del Backend:**
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

3.  **Instalar dependencias del Frontend:**
    ```bash
    cd frontend
    npm install
    ```

4.  **Ejecutar el proyecto:**
    *   **Backend:** `npm run dev:api` (desde la raíz)
    *   **Frontend:** `npm run dev:web` (desde la raíz)

---

## 📡 Endpoints Principales (API)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/auth/login` | Inicio de sesión y generación de JWT |
| `POST` | `/auth/register` | Registro de nuevos clientes |
| `GET` | `/products` | Listado de productos activos |
| `GET` | `/promotions` | Listado de promociones y combos vigentes |
| `POST` | `/checkout` | Procesamiento de órdenes y cálculo de puntos |
| `GET` | `/admin/summary` | KPIs operacionales para el dashboard |
| `GET` | `/admin/sales-kpis` | Reportes de ventas por canal y fecha |
| `GET` | `/customers/account` | Puntos eco y perfil del cliente |

---

## 📚 Documentación Adicional

| Documento | Descripción |
|-----------|-------------|
| [USER_STORIES.md](docs/USER_STORIES.md) | Historias de usuario y lógica de negocio (base lógica) |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitectura técnica, flujo de datos y endpoints |
| [VIDEO_SCRIPT.md](docs/VIDEO_SCRIPT.md) | Guion detallado para los videos de demostración |

---

## 💡 Decisiones Técnicas

1.  **Supabase:** Elegido por su capacidad de escalar rápidamente y ofrecer un backend-as-a-service robusto, permitiendo enfocarse en la lógica de negocio y la experiencia de usuario.
2.  **Tailwind CSS + Headless UI:** Para lograr una estética premium y personalizada sin las limitaciones de frameworks de componentes genéricos.
3.  **FastAPI Repositories:** Implementación del patrón Repository para desacoplar la lógica de base de datos del dominio, facilitando migraciones futuras y testing.
4.  **PWA Integration:** Transformamos la web en una aplicación instalable para mejorar la retención de usuarios y permitir una experiencia fluida en dispositivos móviles.

---

## 🚀 Funcionalidad Extra: Sistema de Lealtad & Combos

### 1. ¿Qué se agregó?
Implementamos un **Sistema de Puntos Eco** y un **Motor de Promociones Dinámico**.
*   **Puntos:** Los usuarios acumulan 1 punto por cada $10 MXN de compra. Pueden canjear bloques de 500 puntos por $100 MXN de descuento directo en el checkout.
*   **Combos:** Un sistema que detecta automáticamente conjuntos de productos en el carrito y aplica descuentos fijos o porcentuales sin necesidad de cupones.

### 2. ¿Por qué es útil comercialmente?
*   **Fidelización:** Los "Puntos Eco" refuerzan la identidad de marca sostenible y aumentan la tasa de recompra.
*   **Aumento de Ticket Promedio (AOV):** Los combos incentivan al usuario a agregar más piezas al carrito para desbloquear beneficios automáticos.
*   **Conversión:** La visualización de "puntos por ganar" en el checkout reduce el abandono del carrito al generar un incentivo inmediato.

### 3. ¿Cómo se implementó?
*   **Lógica Atómica:** El backend calcula los puntos ganados y disponibles en cada transacción, asegurando integridad referencial en Supabase.
*   **UI Dinámica:** En el Checkout, el usuario puede ver en tiempo real cómo su descuento por puntos afecta el total. Para invitados, el sistema calcula y muestra cuántos puntos "están perdiendo" por no estar registrados, impulsando el registro de usuarios.
*   **Motor de Reglas:** Se creó un servicio de promociones que evalúa todas las reglas activas (mínimo de piezas, subtotal, fechas de vigencia) y aplica automáticamente la mejor opción para el cliente.

---

## 🎥 Video Técnico
*(Enlace al video de demostración pronto disponible)*

En el video cubriremos:
*   Flujo de compra de un cliente (Selección, Puntos Eco, Checkout).
*   Panel de administración y gestión de stock.
*   Explicación técnica de la integración de Supabase.

---
**Desarrollado con ❤️ para la revolución sostenible.**
