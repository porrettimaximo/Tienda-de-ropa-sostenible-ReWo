# 🏗️ Arquitectura de ReWo - Guía Completa

## Índice
1. [Visión General](#visión-general)
2. [Principios de Diseño](#principios-de-diseño)
3. [Arquitectura Backend](#arquitectura-backend)
4. [Arquitectura Frontend](#arquitectura-frontend)
5. [Flujos de Datos Clave](#flujos-de-datos-clave)
6. [Patrones y Convenciones](#patrones-y-convenciones)
7. [Manejo de Errores](#manejo-de-errores)
8. [Testing](#testing)

---

## Visión General

ReWo es una **tienda de ropa sostenible** con:
- **Frontend**: E-commerce + Admin panel
- **Backend**: API REST + gestión de negocio
- **BD**: PostgreSQL (Supabase)

### Objetivos de Arquitectura
✅ **Escalabilidad**: Agregar features sin romper existentes
✅ **Mantenibilidad**: Código limpio, fácil de entender
✅ **Testabilidad**: Componentes desacoplados
✅ **Seguridad**: Validación, autenticación, autorización
✅ **Performance**: Queries optimizadas, caching

---

## Principios de Diseño

### 1. **Patrón de Capas (Layered Architecture)**

```
┌─────────────────────────────────────┐
│     API Layer (FastAPI Routers)     │ ← HTTP requests
├─────────────────────────────────────┤
│    Business Logic (Services)         │ ← Reglas de negocio
├─────────────────────────────────────┤
│    Data Access (Repositories)        │ ← BD abstracción
├─────────────────────────────────────┤
│  External Services (Supabase, etc)  │ ← 3rd party
└─────────────────────────────────────┘
```

**Ventajas:**
- Cada capa tiene responsabilidad única (SRP)
- Fácil testing (mockear dependencias)
- Cambios en BD no afectan routers

### 2. **Dependency Injection (DI)**

Todas las dependencias se inyectan, no se crean localmente:

```python
# ❌ MAL
class ProductService:
    def __init__(self):
        self.repo = SupabaseRepository()  # Hard-coded

# ✅ BIEN
class ProductService:
    def __init__(self, repo: EcommerceRepository):
        self.repo = repo  # Inyectada
```

**Beneficio**: Fácil cambiar implementaciones (MemoryRepo → SupabaseRepo)

### 3. **Protocol (Duck Typing) para Interfaces**

```python
class EcommerceRepository(Protocol):  # Interface abstracta
    def list_products(self) -> list[ProductSummary]: ...
    def get_product(self, slug: str) -> ProductDetail: ...
    # ... más métodos

# Cualquier clase que implemente estos métodos es compatible
class SupabaseRepository:
    def list_products(self) -> list[ProductSummary]: ...
    # ✅ Automáticamente implementa el Protocol
```

**Ventaja**: No necesita herencia explícita, tipo duck-typing

### 4. **Separación de Concerns**

```
routers/          → HTTP request/response (validación básica)
services/         → Lógica de negocio (combos, descuentos, puntos)
repositories/     → Acceso a datos (SQL, queries)
domain/           → Modelos de datos (entidades puros)
schemas/          → Request/Response models (DTOs)
```

---

## Arquitectura Backend

### 📁 Estructura de Carpetas

```
apps/api/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Inicialización FastAPI + middleware
│   ├── config.py               # Variables de entorno
│   ├── domain.py               # Modelos de dominio (entidades)
│   ├── schemas.py              # DTOs (Request/Response)
│   ├── security.py             # JWT, autenticación, autorización
│   ├── exceptions.py           # Excepciones personalizadas (TODO)
│   │
│   ├── routers/                # API Layer (HTTP)
│   │   ├── auth.py            # POST /auth/login, POST /auth/register
│   │   ├── products.py        # GET /products (público)
│   │   ├── admin.py           # POST /admin/* (protegido)
│   │   ├── sales.py           # POST /checkout, POST /sales/store
│   │   ├── loyalty.py         # GET /loyalty/* (cliente)
│   │   ├── promotions.py      # GET /promotions (público)
│   │   ├── reports.py         # GET /reports/* (admin)
│   │   └── health.py          # GET /health (público)
│   │
│   ├── services/               # Business Logic Layer
│   │   ├── auth_service.py           # Login, validación Supabase
│   │   ├── catalog_service.py        # Productos, variantes
│   │   ├── sales_service.py          # Checkout, descuentos
│   │   ├── reporting_service.py      # Reportes, KPIs
│   │   ├── promotions_service.py     # CRUD promociones
│   │   ├── suppliers_service.py      # CRUD proveedores
│   │   ├── dependencies.py           # Inyector de dependencias
│   │   └── supabase_client.py        # Cliente Supabase wrapper
│   │
│   ├── repositories/           # Data Access Layer
│   │   ├── base.py            # Protocol (interfaz)
│   │   ├── memory_repository.py    # Demo (datos en RAM)
│   │   ├── supabase_repository.py  # Producción (PostgreSQL)
│   │   └── hybrid_repository.py    # Transitorio (ambas)
│   │
│   └── utils/                  # Utilidades (TODO)
│       ├── validators.py       # Validaciones personalizadas
│       ├── formatters.py       # Formateo de datos
│       └── decorators.py       # Decoradores útiles
│
├── requirements.txt
├── render.yaml
└── .env.example
```

### 🔄 Flujo de una Petición

**Ejemplo: GET /products**

```
1. Cliente → HTTP GET /products
   ↓
2. FastAPI Router (products.py)
   - Valida query params
   - Inyecta CatalogService
   ↓
3. CatalogService.list_products()
   - Lógica de negocio (filtros, ordenamiento)
   - Llama al repositorio
   ↓
4. Repository.list_products()
   - Ejecuta SQL query
   - Retorna datos de BD
   ↓
5. Service mapea a ProductSummary
   ↓
6. Router retorna JSON
   ↓
7. Cliente recibe response
```

### 📊 Capas Explicadas

#### **API Layer (Routers)**

```python
# apps/api/app/routers/products.py
@router.get("", response_model=list[ProductSummary])
def list_products(
    skip: int = 0,
    limit: int = 20,
    category: str | None = None,
    service: CatalogService = Depends(get_catalog_service),
) -> list[ProductSummary]:
    """
    Responsabilidades:
    1. Validar input (query params)
    2. Inyectar dependencias
    3. Llamar servicio
    4. Retornar response con status code correcto
    """
    return service.list_products(skip=skip, limit=limit, category=category)
```

**Reglas:**
- Router valida **structure** de input (tipos, ranges)
- NO hace lógica de negocio
- Inyecta todas las dependencias con `Depends()`
- Retorna modelos con `response_model`

#### **Service Layer (Business Logic)**

```python
# apps/api/app/services/catalog_service.py
class CatalogService:
    def __init__(self, repository: EcommerceRepository):
        self.repository = repository
    
    def list_products(
        self, skip: int = 0, limit: int = 20, category: str | None = None
    ) -> list[ProductSummary]:
        """
        Responsabilidades:
        1. Reglas de negocio (filtros, validaciones)
        2. Transformar datos (domain → DTOs)
        3. Manejo de errores
        4. Cálculos complejos
        """
        products = self.repository.list_products()
        
        # Lógica de negocio
        if category:
            products = [p for p in products if p.category == category]
        
        # Paginar
        products = products[skip : skip + limit]
        
        return products
    
    def get_product(self, product_slug: str) -> ProductDetail:
        """Detalle de producto con variantes"""
        product = self.repository.get_product(product_slug)
        
        if not product:
            raise ProductNotFoundError(f"Product {product_slug} not found")
        
        return product
```

**Reglas:**
- Contiene **toda** la lógica de negocio
- Recibe repositorio en `__init__`
- Retorna DTOs, no entidades raw
- Lanza excepciones personalizadas
- Unit-testeable (mock del repo)

#### **Repository Layer (Data Access)**

```python
# apps/api/app/repositories/base.py
class EcommerceRepository(Protocol):
    """Interfaz para acceso a datos"""
    
    def list_products(self) -> list[ProductSummary]: ...
    def get_product(self, slug: str) -> ProductDetail: ...
    def create_product(self, payload: ProductUpsertRequest) -> ProductDetail: ...
    # ... más métodos

# apps/api/app/repositories/supabase_repository.py
class SupabaseRepository:
    """Implementación con Supabase (PostgreSQL)"""
    
    def __init__(self):
        self.client = create_supabase_client()
    
    def list_products(self) -> list[ProductSummary]:
        """Query SQL real a Supabase"""
        response = self.client.table("products").select("*").execute()
        return [ProductSummary(**row) for row in response.data]
    
    def get_product(self, slug: str) -> ProductDetail:
        """Query con JOIN a variantes"""
        response = (
            self.client
            .from_("products")
            .select("*, product_variants(*)")
            .eq("slug", slug)
            .single()
            .execute()
        )
        # Mapear a dominio
        return ProductDetail(**response.data)

# apps/api/app/repositories/memory_repository.py
class MemoryRepository:
    """Implementación en memoria (testing/demo)"""
    
    def __init__(self):
        self.products = [
            ProductDetail(id="1", name="T-Shirt", ...),
            # ...
        ]
    
    def list_products(self) -> list[ProductSummary]:
        return [
            ProductSummary(
                id=p.id,
                name=p.name,
                price_from=p.variants[0].price if p.variants else 0,
            )
            for p in self.products
        ]
```

**Reglas:**
- **Una** responsabilidad: acceso a datos
- Implementa Protocol `EcommerceRepository`
- No contiene lógica de negocio
- Retorna dominio (ProductDetail, etc.)
- Puede tener lógica de mapeo SQL → dominio

#### **Domain Layer (Modelos)**

```python
# apps/api/app/domain.py
from dataclasses import dataclass
from datetime import datetime

@dataclass
class ProductVariant:
    """Entidad de dominio: variante de producto"""
    id: str
    sku: str
    size: str
    color: str
    stock: int
    price: float

@dataclass
class ProductDetail:
    """Entidad de dominio: detalle completo"""
    id: str
    name: str
    slug: str
    description: str
    category: str
    price_base: float
    variants: list[ProductVariant]
    sustainability_label: str | None = None
    supplier_id: str | None = None
```

**Reglas:**
- Modelos **puros** (sin métodos de lógica)
- Representan entidades del negocio
- Usado en Repository y Service
- NO debe importar de routers/schemas

#### **Schema Layer (DTOs)**

```python
# apps/api/app/schemas.py
from pydantic import BaseModel, Field

class ProductSummary(BaseModel):
    """DTO para listado (resumido)"""
    id: str
    name: str
    slug: str
    category: str
    price_from: float
    image_url: str | None = None
    available_colors: list[str]
    available_sizes: list[str]

class CheckoutRequest(BaseModel):
    """DTO entrada: checkout"""
    customer_id: str | None = None
    customer_email: str | None = None
    items: list[dict] = Field(..., description="[{variant_id, quantity}, ...]")
    shipping_address: str | None = None
    promo_code: str | None = None

class CheckoutResponse(BaseModel):
    """DTO salida: resumen orden"""
    order_id: str
    subtotal: float
    discount_total: float
    total: float
    items: int
```

**Reglas:**
- Usa Pydantic para validación automática
- Separa de entidades de dominio
- Define shape de request/response
- Documentación con `Field(..., description="")`

### 🔐 Seguridad

#### **Autenticación: JWT con Supabase**

```python
# apps/api/app/security.py
from jose import JWTError, jwt
from datetime import datetime, timedelta

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)) -> AuthUser:
    """Dependencia para proteger endpoints"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = await get_user(id=user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

async def require_admin(current_user: AuthUser = Depends(get_current_user)) -> AuthUser:
    """Proteger endpoints admin"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user
```

#### **Uso en Routers**

```python
@router.post("/admin/products")
def create_product(
    payload: ProductUpsertRequest,
    current_user: AuthUser = Depends(require_admin),  # ← Protegido
    service: CatalogService = Depends(get_catalog_service),
):
    product = service.create_product(payload)
    return product
```

---

## Arquitectura Frontend

### 📁 Estructura de Carpetas

```
apps/web/src/
├── App.tsx                 # Router principal
├── main.tsx               # Entry point React
├── config.ts              # Config (API URL, constants)
├── styles.css             # Global styles
│
├── components/            # Componentes compartidos
│   ├── CartContext.tsx    # Context: estado carrito
│   ├── SiteShell.tsx      # Layout: nav + footer
│   ├── Button.tsx         # Botón reutilizable
│   ├── Modal.tsx          # Modal genérico
│   └── Forms/             # Componentes form
│       ├── ProductForm.tsx
│       └── LoginForm.tsx
│
├── pages/                 # Páginas (1 por ruta)
│   ├── HomePage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   ├── LoginPage.tsx
│   ├── AdminDashboardPage.tsx
│   ├── AdminCatalogPage.tsx
│   ├── AdminPromotionsPage.tsx
│   └── ... (13 páginas total)
│
├── data/                  # Estado y datos
│   ├── store.ts          # Datos mock (testing)
│   └── types.ts          # TypeScript types globales
│
├── lib/                   # Librerías y utilidades
│   ├── api.ts            # Cliente HTTP
│   ├── auth.ts           # Funciones auth (login, logout)
│   ├── storage.ts        # localStorage wrapper
│   └── utils.ts          # Helpers (format, parse, etc)
│
└── hooks/                # Custom hooks (TODO)
    ├── useAuth.ts
    ├── useCart.ts
    ├── useFetch.ts
    └── useLocalStorage.ts
```

### 🔄 Flujo de Datos Frontend

```
Browser Input (click, form)
      ↓
Page Component (ProductDetailPage.tsx)
      ↓
Context / Local State (CartContext.useState)
      ↓
API call (api.ts)
      ↓
Backend API
      ↓
Response → Parse → Update State
      ↓
Component re-render → User sees result
```

### 📦 State Management

**Estrategia: Context API + localStorage**

```typescript
// components/CartContext.tsx
interface CartItem {
  variantId: string;
  quantity: number;
  price: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Leer de localStorage en init
    const saved = localStorage.getItem("ecowear-cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Sincronizar con localStorage en cada cambio
  useEffect(() => {
    localStorage.setItem("ecowear-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems([...items, item]);
  };

  // ... más métodos

  return (
    <CartContext.Provider value={{ items, addItem, ... }}>
      {children}
    </CartContext.Provider>
  );
}

// Uso en componentes
function ProductDetailPage() {
  const { addItem } = useContext(CartContext)!;
  
  const handleAddToCart = () => {
    addItem({ variantId: "v1", quantity: 1, price: 100 });
  };
}
```

**Ventajas:**
- Simple para estado compartido
- Bueno para 2-3 niveles de profundidad
- localStorage para persistencia

### 🌐 Client API

```typescript
// lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface ApiOptions {
  headers?: Record<string, string>;
  method?: "GET" | "POST" | "PUT" | "DELETE";
}

export async function apiCall<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Agregar token de auth si existe
  const token = localStorage.getItem("auth_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "API Error");
  }

  return response.json();
}

// Uso
const products = await apiCall<ProductSummary[]>("/products");
```

### 🎨 Styling Strategy

**Tailwind CSS + CSS custom properties**

```css
/* styles.css */
:root {
  --color-primary: #10b981;    /* green */
  --color-secondary: #f59e0b;  /* amber */
  --color-error: #ef4444;      /* red */
}

body {
  @apply bg-gray-50 text-gray-900 font-sans;
}

.btn-primary {
  @apply px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600;
}
```

```tsx
// components/Button.tsx
export function Button({ variant = "primary", ...props }) {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "btn-danger",
  };

  return <button className={variants[variant]} {...props} />;
}
```

---

## Flujos de Datos Clave

### 🛒 Flujo: Cliente compra (Checkout)

```
1. Cliente llena carrito (localStorage)
   └─ items: [{variantId, quantity, price}]

2. Click "Checkout" → CheckoutPage
   └─ Leer items de CartContext
   └─ Mostrar resumen + form envío

3. Submit form
   └─ POST /checkout (CheckoutRequest)
   ├─ customer_id (si logueado)
   ├─ items
   └─ shipping_address

4. Backend (SalesService.checkout)
   ├─ Validar stock de items
   ├─ Aplicar promoción (si aplica)
   ├─ Calcular puntos lealtad
   ├─ Crear Orden en BD
   ├─ Decrementar stock
   └─ Retorna OrderSummary

5. Frontend
   ├─ Guardar order_id
   ├─ Limpiar carrito (CartContext.clearCart())
   ├─ Redirigir a /orders/:orderId
   └─ Mostrar resumen

6. Confirmación
   └─ Cliente puede ver detalles, descargar factura
```

### 👤 Flujo: Admin gestiona promociones

```
1. Admin login
   └─ POST /auth/login/admin
   └─ Retorna: {access_token, user: {id, name, role: "admin"}}
   └─ Frontend guardar token en localStorage

2. Navigate /admin/promotions
   └─ AdminPromotionsPage
   └─ GET /admin/promotions (con Authorization header)
   └─ Service lista de promociones

3. Admin crea promoción
   └─ Form: name, description, type, discount, dates
   └─ POST /admin/promotions (PromotionUpsertRequest)
   └─ Service.create_promotion() → Repository
   └─ Retorna Promotion creada

4. Admin edita/activa
   └─ PUT /admin/promotions/{id}
   └─ PUT /admin/promotions/{id}/active

5. Aplicación automática
   └─ En checkout, servicio busca promociones activas
   └─ Aplica descuento según reglas
   └─ Cliente ve descuento en total
```

---

## Patrones y Convenciones

### Naming Conventions

| Elemento | Patrón | Ejemplo |
|----------|--------|---------|
| Archivos py | `snake_case.py` | `catalog_service.py` |
| Clases Python | `PascalCase` | `CatalogService` |
| Funciones Python | `snake_case` | `list_products()` |
| Archivos TypeScript | `PascalCase.tsx/.ts` | `ProductDetailPage.tsx` |
| Funciones TypeScript | `camelCase` | `getProductList()` |
| Constantes | `UPPER_SNAKE_CASE` | `MAX_ITEMS = 20` |
| Variables | `camelCase` (TS), `snake_case` (Py) | `currentUser`, `is_admin` |
| URLs API | kebab-case | `/products`, `/admin/promotions` |
| Base de datos | `snake_case_plural` | `products`, `product_variants` |

### Code Style

**Python (FastAPI)**
```python
# Imports agrupados
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

# Enums para valores fijos
from enum import Enum

class SalesChannel(str, Enum):
    ONLINE = "online"
    STORE = "store"

# Type hints siempre
def process_order(
    order_id: str,
    channel: SalesChannel = SalesChannel.ONLINE,
) -> OrderSummary:
    pass

# Docstrings para funciones públicas
def calculate_discount(items: list[OrderItem]) -> float:
    """
    Calcula descuento aplicable según reglas de negocio.
    
    Args:
        items: Items de la orden
    
    Returns:
        Monto de descuento en pesos
    
    Raises:
        ValueError: Si items inválidos
    """
    pass
```

**TypeScript (React)**
```typescript
// Types claros
interface Product {
  id: string;
  name: string;
  price: number;
  variants: ProductVariant[];
}

interface CartItem {
  variantId: string;
  quantity: number;
}

// Componentes con tipos
interface ProductDetailPageProps {
  productSlug: string;
}

export function ProductDetailPage({ productSlug }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  return <div>{/* ... */}</div>;
}

// Handlers con tipos
const handleAddToCart = (variantId: string, qty: number): void => {
  // ...
};
```

### Error Handling

**Backend**
```python
# Custom exceptions
class ReWoException(Exception):
    """Base exception for ReWo API"""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code

class ProductNotFoundError(ReWoException):
    def __init__(self, product_id: str):
        super().__init__(
            f"Product {product_id} not found",
            status_code=404
        )

class InsufficientStockError(ReWoException):
    def __init__(self, variant_id: str, requested: int, available: int):
        super().__init__(
            f"Insufficient stock: requested {requested}, available {available}",
            status_code=400
        )

# Exception handlers
@app.exception_handler(ReWoException)
async def rewo_exception_handler(request: Request, exc: ReWoException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )

# Uso en service
def checkout(self, payload: CheckoutRequest) -> OrderSummary:
    for item in payload.items:
        variant = self.repository.get_variant(item.variant_id)
        if variant.stock < item.quantity:
            raise InsufficientStockError(
                variant_id=item.variant_id,
                requested=item.quantity,
                available=variant.stock
            )
    # ... crear orden
```

**Frontend**
```typescript
// Error handling en API calls
async function fetchProducts(): Promise<Product[] | null> {
  try {
    return await apiCall<Product[]>("/products");
  } catch (error) {
    console.error("Error fetching products:", error);
    // Mostrar toast o notificación al usuario
    showNotification("Error loading products", "error");
    return null;
  }
}

// En componentes
function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(data => {
        if (data) setProducts(data);
      })
      .catch(err => {
        setError(err.message);
      });
  }, []);

  if (error) return <div className="error">{error}</div>;
  if (!products.length) return <div>Loading...</div>;

  return <div>{/* render products */}</div>;
}
```

---

## Manejo de Errores

### HTTP Status Codes

| Código | Uso | Ejemplo |
|--------|-----|---------|
| 200 | OK - Request exitoso | GET /products |
| 201 | Created - Recurso creado | POST /admin/products |
| 400 | Bad Request - Input inválido | Items sin variantId |
| 401 | Unauthorized - No autenticado | Token expirado |
| 403 | Forbidden - Autorización fallida | Cliente queriendo admin |
| 404 | Not Found - Recurso no existe | GET /products/invalid-slug |
| 409 | Conflict - Validación negocio | Stock insuficiente |
| 500 | Server Error - Error interno | Bug en código |

### Respuestas de Error

```python
# Response en caso de error
{
  "detail": "Product variant not found",
  "error_code": "VARIANT_NOT_FOUND",  # Para frontend identificar
  "status_code": 404
}

# Con validación Pydantic
{
  "detail": [
    {
      "type": "value_error.missing",
      "loc": ["body", "items"],
      "msg": "field required"
    }
  ]
}
```

---

## Testing

### Estrategia (TODO: Implementar)

```
apps/api/
├── tests/
│   ├── conftest.py              # Fixtures compartidas
│   ├── test_services/
│   │   ├── test_catalog_service.py
│   │   ├── test_sales_service.py
│   │   └── test_promotions_service.py
│   ├── test_routers/
│   │   ├── test_products.py
│   │   ├── test_admin.py
│   │   └── test_checkout.py
│   └── test_repositories/
│       └── test_memory_repository.py

apps/web/
├── src/
│   └── __tests__/
│       ├── components/
│       │   ├── CartContext.test.tsx
│       │   └── Button.test.tsx
│       ├── pages/
│       │   ├── HomePage.test.tsx
│       │   └── CheckoutPage.test.tsx
│       └── lib/
│           ├── api.test.ts
│           └── utils.test.ts
```

### Testing Backend (Pytest)

```python
# tests/test_services/test_sales_service.py
import pytest
from app.services.sales_service import SalesService
from app.schemas import CheckoutRequest
from app.repositories.memory_repository import MemoryRepository

@pytest.fixture
def sales_service():
    """Fixture: servicio con repo mock"""
    repo = MemoryRepository()
    return SalesService(repo)

def test_checkout_applies_promotion(sales_service):
    """Test: descuento aplicado en checkout"""
    request = CheckoutRequest(
        customer_id="c1",
        items=[
            {"variant_id": "v1", "quantity": 2},
            {"variant_id": "v2", "quantity": 2},
        ]
    )
    
    order = sales_service.checkout(request)
    
    assert order.discount_total > 0
    assert order.total < order.subtotal

def test_insufficient_stock_raises_error(sales_service):
    """Test: excepción si stock insuficiente"""
    request = CheckoutRequest(
        customer_id="c1",
        items=[
            {"variant_id": "v1", "quantity": 1000},  # Stock no disponible
        ]
    )
    
    with pytest.raises(InsufficientStockError):
        sales_service.checkout(request)
```

### Testing Frontend (Vitest + React Testing Library)

```typescript
// src/__tests__/components/CartContext.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { CartProvider, CartContext } from "../../components/CartContext";

function TestComponent() {
  const { items, addItem, total } = useContext(CartContext)!;
  
  return (
    <div>
      <p data-testid="count">{items.length}</p>
      <p data-testid="total">{total}</p>
      <button onClick={() => addItem({ variantId: "v1", quantity: 1 })}>
        Add
      </button>
    </div>
  );
}

test("adds item to cart", () => {
  render(
    <CartProvider>
      <TestComponent />
    </CartProvider>
  );
  
  fireEvent.click(screen.getByText("Add"));
  
  expect(screen.getByTestId("count")).toHaveTextContent("1");
});
```

---

## Resumen de Arquitectura

```
┌──────────────────────────────────────────────────────────────────┐
│                     Frontend (React)                             │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Pages (ProductDetail, Cart, Admin)                          │ │
│  │ ↓                                                           │ │
│  │ Context (CartContext) + State                              │ │
│  │ ↓                                                           │ │
│  │ API Client (lib/api.ts)                                    │ │
│  └─────────────────────────────────────────────────────────────┘ │
└────────────────────────┬─────────────────────────────────────────┘
                         │ HTTP (REST)
                         ↓
┌──────────────────────────────────────────────────────────────────┐
│                     Backend (FastAPI)                            │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Routers (HTTP endpoints)                                    │ │
│  │ ↓                                                           │ │
│  │ Services (Business Logic)                                  │ │
│  │ ↓                                                           │ │
│  │ Repositories (Data Access)                                 │ │
│  │ ↓                                                           │ │
│  │ PostgreSQL (Supabase)                                      │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

**Siguiente paso**: Refactorizar código según estos patrones y documentación.
