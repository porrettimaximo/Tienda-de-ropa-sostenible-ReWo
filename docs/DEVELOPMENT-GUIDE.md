# 🚀 Guía de Desarrollo - ReWo

## Tabla de Contenidos
1. [Setup Inicial](#setup-inicial)
2. [Ejecutar Proyecto](#ejecutar-proyecto)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Flujo de Desarrollo](#flujo-de-desarrollo)
5. [Debugging](#debugging)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## Setup Inicial

### 📋 Requisitos
- Node.js 18+ y npm
- Python 3.10+
- Git
- Cuenta Supabase

### 1️⃣ Clonar Repositorio

```bash
git clone <repo-url>
cd "Tienda de ropa sostenible ReWo"
```

### 2️⃣ Instalar Dependencias

**Backend (Python):**
```bash
cd apps/api
python -m venv venv

# Windows
.\venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# Instalar paquetes
pip install -r requirements.txt
```

**Frontend (Node):**
```bash
cd apps/web
npm install
```

### 3️⃣ Configurar Variables de Entorno

**Backend** - `apps/api/.env`:
```bash
# Copia el contenido de .env.example
APP_NAME=ReWo API
APP_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
ADMIN_EMAILS=admin@ecowear.mx,otro@admin.mx
```

**Frontend** - `apps/web/.env`:
```bash
VITE_API_URL=http://localhost:8000
```

### 4️⃣ Inicializar Base de Datos

```bash
# Aplicar migraciones en Supabase
# (desde Supabase dashboard o con supabase CLI)

# O seed de datos demo
psql postgresql://postgres:password@localhost:5432/postgres < supabase/seed.sql
```

---

## Ejecutar Proyecto

### ✅ Opción 1: Desde Root (Recomendado)

```bash
# Terminal 1: Backend
npm run dev:api

# Terminal 2: Frontend  
npm run dev:web

# Resultado:
# API:   http://localhost:8000
# Web:   http://localhost:5173
# Docs:  http://localhost:8000/docs (Swagger)
```

### ✅ Opción 2: Individual

**Backend:**
```bash
cd apps/api
source venv/bin/activate  # Activar venv
python -m uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd apps/web
npm run dev
```

### 🧪 Mock sin Supabase (Development)

Si no tienes Supabase configurado:

1. Backend automáticamente usa `MemoryRepository` si `SUPABASE_URL` está vacío
2. Frontend envía requests a `http://localhost:8000`
3. Datos son demo/hardcodeados

---

## Estructura de Carpetas

### Backend (`apps/api/`)

```
apps/api/
├── app/
│   ├── main.py                    # Punto entrada, routers, middleware
│   ├── config.py                  # Settings desde .env
│   ├── domain.py                  # Modelos de dominio (entidades)
│   ├── schemas.py                 # DTOs (request/response)
│   ├── security.py                # JWT, autenticación
│   ├── exceptions.py              # Excepciones personalizadas (NEW)
│   │
│   ├── routers/
│   │   ├── auth.py               # POST /auth/login, register
│   │   ├── products.py           # GET /products
│   │   ├── admin.py              # POST /admin/*
│   │   ├── sales.py              # POST /checkout
│   │   ├── loyalty.py            # GET /loyalty/*
│   │   ├── promotions.py         # GET /promotions
│   │   ├── reports.py            # GET /reports/*
│   │   └── health.py             # GET /health
│   │
│   ├── services/
│   │   ├── auth_service.py       # Autenticación
│   │   ├── catalog_service.py    # Catálogo/productos
│   │   ├── sales_service.py      # Checkout/ventas
│   │   ├── reporting_service.py  # Reportes/KPIs
│   │   ├── promotions_service.py # Gestión de promos
│   │   ├── suppliers_service.py  # Proveedores
│   │   ├── dependencies.py       # Inyector DI
│   │   └── supabase_client.py    # Cliente Supabase wrapper
│   │
│   ├── repositories/
│   │   ├── base.py              # Protocol (interfaz)
│   │   ├── memory_repository.py # Demo
│   │   ├── supabase_repository.py # Producción
│   │   └── hybrid_repository.py # Ambas
│   │
│   └── utils/                   # Utilidades (NEW)
│       ├── validators.py        # Validaciones custom
│       ├── formatters.py        # Formateo de datos
│       └── decorators.py        # Decoradores útiles
│
├── tests/                        # Tests (NEW)
│   ├── conftest.py
│   ├── test_services/
│   ├── test_routers/
│   └── test_repositories/
│
├── requirements.txt              # Dependencias Python
├── render.yaml                   # Config deploy
├── .env.example                  # Template .env
└── README.md
```

### Frontend (`apps/web/`)

```
apps/web/
├── src/
│   ├── App.tsx                  # Router principal
│   ├── main.tsx                 # Entry point
│   ├── config.ts                # Config (API URL, constants)
│   ├── styles.css               # Global styles
│   │
│   ├── components/
│   │   ├── CartContext.tsx      # Estado carrito (Context)
│   │   ├── SiteShell.tsx        # Layout base
│   │   ├── Button.tsx           # Botón reutilizable (NEW)
│   │   ├── Modal.tsx            # Modal genérico (NEW)
│   │   └── Forms/
│   │       ├── ProductForm.tsx
│   │       └── LoginForm.tsx
│   │
│   ├── pages/                   # Páginas (1 por ruta)
│   │   ├── HomePage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── AdminDashboardPage.tsx
│   │   ├── AdminCatalogPage.tsx
│   │   ├── AdminPromotionsPage.tsx
│   │   └── ... (13 total)
│   │
│   ├── data/
│   │   ├── store.ts            # Mock data
│   │   └── types.ts            # TypeScript types (NEW)
│   │
│   ├── lib/
│   │   ├── api.ts              # Cliente HTTP
│   │   ├── auth.ts             # Funciones auth (NEW)
│   │   ├── storage.ts          # localStorage wrapper (NEW)
│   │   └── utils.ts            # Helpers
│   │
│   ├── hooks/                  # Custom hooks (NEW)
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── useFetch.ts
│   │
│   └── __tests__/              # Tests (NEW)
│       ├── components/
│       ├── pages/
│       └── lib/
│
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Flujo de Desarrollo

### 📝 Crear Nueva Feature

**1. Crear rama**
```bash
git checkout -b feat/my-feature
```

**2. Implementar Backend**

Ejemplo: Crear endpoint `/admin/stocks`

```python
# apps/api/app/routers/admin.py
@router.get("/stocks", response_model=list[StockSummary])
def list_low_stock(
    threshold: int = Query(5, description="Stock threshold"),
    current_user: AuthUser = Depends(require_admin),
    service: CatalogService = Depends(get_catalog_service),
):
    """List products with stock below threshold."""
    return service.list_low_stock(threshold=threshold)

# apps/api/app/services/catalog_service.py
def list_low_stock(self, threshold: int = 5) -> list[StockSummary]:
    """Get products with stock below threshold."""
    products = self.repository.list_product_details()
    low_stock = []
    
    for product in products:
        for variant in product.variants:
            if variant.stock < threshold:
                low_stock.append(StockSummary(
                    product_id=product.id,
                    product_name=product.name,
                    variant_id=variant.id,
                    size=variant.size,
                    color=variant.color,
                    current_stock=variant.stock,
                    threshold=threshold,
                ))
    
    return low_stock

# apps/api/app/domain.py
@dataclass
class StockSummary:
    product_id: str
    product_name: str
    variant_id: str
    size: str
    color: str
    current_stock: int
    threshold: int
```

**3. Implementar Frontend**

```typescript
// src/pages/AdminStocksPage.tsx
import { useEffect, useState } from "react";
import { apiCall } from "../lib/api";

interface StockSummary {
  product_id: string;
  product_name: string;
  current_stock: number;
  threshold: number;
}

export function AdminStocksPage() {
  const [stocks, setStocks] = useState<StockSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStocks();
  }, []);

  async function loadStocks(): Promise<void> {
    try {
      const data = await apiCall<StockSummary[]>("/admin/stocks?threshold=5");
      setStocks(data);
    } catch (err) {
      console.error("Error loading stocks:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Low Stock Alerts</h1>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Current</th>
            <th>Threshold</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((item) => (
            <tr key={item.variant_id}>
              <td>{item.product_name}</td>
              <td>{item.current_stock}</td>
              <td>{item.threshold}</td>
              <td className={item.current_stock === 0 ? "text-red-600" : "text-yellow-600"}>
                {item.current_stock === 0 ? "Out of Stock" : "Low"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// src/App.tsx - agregar ruta
import { AdminStocksPage } from "./pages/AdminStocksPage";

// En Routes:
<Route
  path="/admin/stocks"
  element={
    <SiteShell>
      <AdminStocksPage />
    </SiteShell>
  }
/>
```

**4. Tests** (TODO después)

```python
# apps/api/tests/test_services/test_catalog_service.py
def test_list_low_stock(catalog_service):
    """Test: list products with low stock."""
    low_stock = catalog_service.list_low_stock(threshold=5)
    
    assert len(low_stock) > 0
    assert all(item.current_stock < 5 for item in low_stock)
```

**5. Commit y Push**

```bash
git add .
git commit -m "feat(admin): add low stock alerts endpoint"
git push origin feat/my-feature
```

### 🔍 Review Antes de Merge

- [ ] Backend: Tests pasando, types checkeados
- [ ] Frontend: No hay TypeScript errors
- [ ] API docs actualizados (Swagger)
- [ ] Documentación (ARCHITECTURE.md) actualizada si cambios estructurales

---

## Debugging

### Backend (Python)

**1. Con prints (desarrollo rápido)**
```python
from app.config import settings
import logging

logger = logging.getLogger(__name__)

def list_products():
    logger.debug(f"Fetching products from {settings.env} environment")
    products = repository.list_products()
    logger.info(f"Found {len(products)} products")
    return products
```

**2. Con VS Code Debugger**

Crear `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": ["app.main:app", "--reload"],
      "jinja": true,
      "cwd": "${workspaceFolder}/apps/api"
    }
  ]
}
```

Luego en VS Code: `Ctrl+Shift+D` → Play button

**3. Ver requests HTTP**

```bash
# Instalar
pip install httpx

# Usar en servicio
import httpx
client = httpx.Client()
response = client.get("https://api.example.com/data")
print(response.json())
```

### Frontend (React/TypeScript)

**1. React DevTools Browser Extension**
- Chrome: React Developer Tools
- Firefox: React Developer Tools
- Inspecciona estado, props, contexts

**2. Network tab en Chrome DevTools**
- Ctrl+Shift+I → Network
- Ver todas las peticiones HTTP
- Ver requests/responses

**3. Console Logs**
```typescript
useEffect(() => {
  console.log("Effect running, product:", product);
  
  if (!product) return;
  
  console.log("Product loaded:", { 
    name: product.name,
    variants: product.variants.length 
  });
}, [product]);
```

**4. Error Boundary (TODO)**

```typescript
export class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>;
    }

    return this.props.children;
  }
}
```

---

## Deployment

### 🌐 Frontend (Netlify)

**1. Build local**
```bash
cd apps/web
npm run build
```

Genera: `dist/` (archivos estáticos)

**2. Deploy a Netlify**

```bash
# Opción A: Drag & drop dist/ a netlify.com
# Opción B: Conectar GitHub
# Opción C: Con CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Configurar variable de entorno:**
- Netlify Dashboard → Site settings → Build & deploy → Environment
- Agregar: `VITE_API_URL=https://rewo-api.onrender.com`

### ⚙️ Backend (Render)

**1. Render.yaml** - Ya existe

```yaml
services:
  - type: web
    name: rewo-api
    runtime: python
    plan: free
    rootDir: apps/api
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: SUPABASE_URL
        scope: all
        value: https://...
      # Más variables...
```

**2. Deploy**

```bash
# Conectar Render a GitHub
# Push a main branch
# Render automáticamente deploya
```

**3. Environment Variables en Render**
- Render Dashboard → Services → rewo-api → Environment
- Copiar de .env local: SUPABASE_URL, KEYS, etc

### 🗄️ Database (Supabase)

**Ya está en la nube**, solo:

1. Aplicar migraciones:
   ```bash
   supabase migration up
   ```

2. Ver data: Supabase Dashboard → SQL Editor

---

## Troubleshooting

### ❌ Error: "Module not found: app"

**Backend:**
```bash
# Asegurar que estás en carpeta correcta
cd apps/api

# Activar venv
source venv/bin/activate

# Instalar requerimientos
pip install -r requirements.txt

# Ejecutar desde ahí
python -m uvicorn app.main:app --reload
```

### ❌ Error: "Cannot find module '@/components'"

**Frontend:**
- Tsconfig path mapping: Ver `apps/web/tsconfig.json`
- Reiniciar servidor: `npm run dev`

### ❌ CORS Error

**Backend** - verificar `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambiar a dominio específico en prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
```

### ❌ Supabase no conecta

**Verificar .env:**
```bash
# Estos no deben estar vacíos
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...

# Backend automáticamente cae a MemoryRepository si vacíos
```

**Test conexión:**
```python
from app.services.supabase_client import create_supabase_client
client = create_supabase_client()
response = client.table("products").select("*").limit(1).execute()
print(response.data)
```

### ❌ Tests no corren

**Backend:**
```bash
# Instalar pytest
pip install pytest pytest-asyncio

# Correr tests
pytest apps/api/tests -v

# Con coverage
pytest apps/api/tests --cov=app
```

---

## Comandos Útiles

```bash
# BACKEND
cd apps/api
python -m uvicorn app.main:app --reload          # Ejecutar con hot reload
python -m pytest tests/ -v                        # Tests
python -m black app/                              # Formatear código
python -m flake8 app/                             # Linting

# FRONTEND  
cd apps/web
npm run dev                                       # Dev server
npm run build                                     # Build producción
npm run preview                                   # Ver build localmente
npm run lint                                      # Linting (si configurado)
npm run type-check                                # TypeScript check (si configurado)

# GIT
git log --oneline                                 # Ver commits
git diff                                          # Ver cambios
git stash                                         # Guardar cambios temporalmente
git branch -a                                     # Ver todas las ramas
```

---

**¡Listo para desarrollar!** 🎉

