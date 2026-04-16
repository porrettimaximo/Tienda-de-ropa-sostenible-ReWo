# 🌿 ReWo - Tienda de Ropa Sostenible

**E-commerce moderno para marcas sostenibles.** Catálogo, checkout, programa de lealtad, panel admin y reportes.

> Status: 📊 MVP visual completo (100%) | Backend estructurado (40%) | Integración Supabase pendiente

---

## 🎯 Quick Links

📖 **[Arquitectura Completa](docs/ARCHITECTURE.md)** - Visión general, capas, patrones  
📋 **[Estándares de Código](docs/CODING-STANDARDS.md)** - Naming, type hints, docstrings  
🚀 **[Guía de Desarrollo](docs/DEVELOPMENT-GUIDE.md)** - Setup, ejecutar, debugging  
📊 **[Diagramas](docs/ARCHITECTURE-DIAGRAMS.md)** - Flujos de datos, BD relacional  

---

## 🏗️ Stack Tecnológico

### Frontend
- **React 18** + **TypeScript** 5.6 - UI components tipo-safe
- **Vite** 5.4 - Build + HMR ultra-rápido
- **Tailwind CSS** 3.4 - Styling utility-first
- **React Router** 6.28 - Client-side routing (16 rutas)

### Backend
- **FastAPI** 0.115 - Web framework con validación automática
- **Python** 3.10+ - Tipado con type hints
- **Pydantic** - Validación de datos
- **Python-Jose** - JWT authentication

### Base de Datos & Auth
- **Supabase** (PostgreSQL) - BD + Auth en una plataforma
- **Supabase Auth** - OAuth + email/password

### Deploy
- **Frontend**: Netlify (static hosting)
- **Backend**: Render (serverless)
- **Database**: Supabase (managed PostgreSQL)

---

## 📁 Estructura del Proyecto

```
ReWo/
├── apps/
│   ├── web/              # React + Vite frontend (16 páginas)
│   │   ├── src/
│   │   │   ├── pages/    # ProductDetail, Admin, etc
│   │   │   ├── components/  # CartContext, Button, etc
│   │   │   ├── lib/      # API client, helpers
│   │   │   └── data/     # Mock data & types
│   │   └── package.json
│   │
│   └── api/              # FastAPI backend (30+ endpoints)
│       ├── app/
│       │   ├── routers/  # HTTP (auth, products, admin, sales, etc)
│       │   ├── services/ # Business logic (catalog, sales, loyalty)
│       │   ├── repositories/ # Data access (Protocol-based)
│       │   └── domain.py # Modelos de dominio
│       ├── requirements.txt
│       └── render.yaml
│
├── docs/                 # Documentación completa
│   ├── ARCHITECTURE.md   # Diseño & patrones
│   ├── CODING-STANDARDS.md # Guía de código
│   ├── DEVELOPMENT-GUIDE.md # Cómo empezar
│   └── ARCHITECTURE-DIAGRAMS.md # Diagramas Mermaid
│
└── supabase/
    ├── migrations/       # SQL migrations (3)
    └── seed.sql         # Datos iniciales
```

---

## 🚀 Inicio Rápido

### 1. Clone & Install

```bash
git clone <repo-url>
cd "Tienda de ropa sostenible ReWo"

# Backend
cd apps/api
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd ../web
npm install
```

### 2. Configurar .env

**`apps/api/.env`:**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_EMAILS=admin@ecowear.mx
```

**`apps/web/.env`:**
```bash
VITE_API_URL=http://localhost:8000
```

### 3. Ejecutar

```bash
# Terminal 1: Backend
cd apps/api && python -m uvicorn app.main:app --reload

# Terminal 2: Frontend
cd apps/web && npm run dev

# Resultado:
# API:  http://localhost:8000 (Swagger docs: /docs)
# Web:  http://localhost:5173
```

---

## 📊 Funcionalidades Implementadas

### ✅ Cliente (E-commerce)
- [x] Home page con hero
- [x] Catálogo de productos (filtrable)
- [x] Detalle de producto (talla, color, stock)
- [x] Carrito (localStorage)
- [x] Checkout simplificado
- [x] Login/Register
- [x] Mi cuenta + historial de órdenes
- [x] Programa de lealtad (UI)

### ✅ Admin
- [x] Dashboard con KPIs
- [x] Gestión de productos (CRUD)
- [x] Gestión de variantes (talla, color, stock, precio)
- [x] Gestión de promociones (crear, activar/desactivar)
- [x] Gestión de proveedores éticos
- [x] Ventas tienda física (registro)
- [x] Reportes: ventas por talla/color, KPIs

### ✅ Backend
- [x] API REST completa (8 routers, 30+ endpoints)
- [x] Autenticación con JWT
- [x] Roles (client/admin)
- [x] Validación automática (Pydantic)
- [x] Patrón Repository (abstracto)
- [x] Cálculo básico de descuentos

### ⏳ Pendiente (Próxima Fase)
- [ ] Integración Supabase productiva
- [ ] Lógica completa de puntos lealtad
- [ ] Gestión de stock (decrementar en checkout, alertas)
- [ ] Cálculo avanzado de descuentos (por producto, %)
- [ ] Métodos de pago (Stripe, etc)
- [ ] Tests (Pytest, Vitest)
- [ ] Email notifications
- [ ] Búsqueda full-text

---

## 🏛️ Principios de Arquitectura

### Layered Architecture
```
Routers (HTTP) → Services (Business Logic) → Repositories (Data Access) → Database
```

### Dependency Injection
Todas las dependencias se inyectan (no se crean locally), facilitando tests y cambios.

### Protocol-based Repositories
Interfaz abstracta = fácil cambiar de MemoryRepository a SupabaseRepository sin tocar services.

### Type Safety
Type hints en Python + TypeScript en React = errores atrapados en IDE, no en runtime.

---

## 📚 Documentación

| Doc | Propósito |
|-----|-----------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Diseño de capas, patrones, flujos |
| [CODING-STANDARDS.md](docs/CODING-STANDARDS.md) | Convenciones, type hints, docstrings |
| [DEVELOPMENT-GUIDE.md](docs/DEVELOPMENT-GUIDE.md) | Setup, cómo correr, debugging |
| [ARCHITECTURE-DIAGRAMS.md](docs/ARCHITECTURE-DIAGRAMS.md) | Diagramas Mermaid (10+) |
| [requerimientos-cliente.md](docs/requerimientos-cliente.md) | Brief del cliente |
| [data-model.md](docs/data-model.md) | Esquema de BD |

---

## 🔧 Comandos Clave

```bash
# Backend
npm run dev:api                # Ejecutar con hot-reload
cd apps/api && pytest tests/   # Correr tests

# Frontend
npm run dev:web               # Dev server
npm run build:web             # Build producción
npm run preview:web           # Preview del build

# Database
supabase migration up         # Aplicar migraciones
```

---

## 🛠️ Debugging

**Backend**: VS Code debugger (`.vscode/launch.json` configurado)  
**Frontend**: React DevTools (browser extension)  
**Network**: Chrome DevTools → Network tab  

Ver [DEVELOPMENT-GUIDE.md](docs/DEVELOPMENT-GUIDE.md#debugging) para más.

---

## 📦 Deploy

### Supabase (Database)
```bash
supabase db push          # Aplicar migraciones
supabase db seed seed.sql # Seedear datos
```

### Backend → Render
```yaml
# render.yaml (ya configurado)
buildCommand: pip install -r requirements.txt
startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Push a main branch → Render deploya automáticamente.

### Frontend → Netlify
```bash
cd apps/web
npm run build
# Drag & drop `dist/` a netlify.com o conectar GitHub
```

---

## 🤝 Contribuir

1. Crear rama: `git checkout -b feat/my-feature`
2. Implementar (ver [DEVELOPMENT-GUIDE.md](docs/DEVELOPMENT-GUIDE.md#flujo-de-desarrollo))
3. Commit: `git commit -m "feat(scope): description"` (Conventional Commits)
4. Push: `git push origin feat/my-feature`
5. PR & review

---

## 📄 Licencia

MIT

---

## 👥 Soporte

Para preguntas sobre arquitectura → Ver [ARCHITECTURE.md](docs/ARCHITECTURE.md)  
Para setup → Ver [DEVELOPMENT-GUIDE.md](docs/DEVELOPMENT-GUIDE.md)  
Para estándares de código → Ver [CODING-STANDARDS.md](docs/CODING-STANDARDS.md)  

**¡Bienvenido al proyecto! 🌿**

Por qué es útil comercialmente: Mejora la comunicación con el cliente y asegura que el equipo del negocio actúe rápido ante situaciones importantes.

Cómo implementarlo: Integrar un servicio de mensajería (como SendGrid para emails) gatillado por eventos específicos en la base de datos

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

