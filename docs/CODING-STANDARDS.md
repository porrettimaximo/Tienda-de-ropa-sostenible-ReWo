# 📏 Estándares de Código - ReWo

## Tabla de Contenidos
1. [Python / FastAPI](#python--fastapi)
2. [TypeScript / React](#typescript--react)
3. [SQL / Migraciones](#sql--migraciones)
4. [Commits y Versionado](#commits-y-versionado)
5. [Review Checklist](#review-checklist)

---

## Python / FastAPI

### ✅ Imports

**Orden correcto:**
```python
# 1. Standard library
from typing import Optional, Protocol
from dataclasses import dataclass
from datetime import datetime
import logging

# 2. Third-party
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from supabase import create_client, Client

# 3. Local app
from app.config import settings
from app.domain import Product, ProductDetail
from app.services.catalog_service import CatalogService
from app.repositories.base import EcommerceRepository
```

**Herramientas de formateo:**
```bash
# Ordenar imports automáticamente
isort app/

# Formatear código
black app/

# Linting
flake8 app/
```

### ✅ Type Hints

**SIEMPRE usar type hints:**
```python
# ❌ MAL
def list_products(skip, limit):
    return products[skip:skip+limit]

# ✅ BIEN
def list_products(skip: int = 0, limit: int = 20) -> list[ProductSummary]:
    """List all products with pagination."""
    return products[skip : skip + limit]

# Con Optional
def get_product(slug: str) -> ProductDetail | None:
    """Get product by slug, returns None if not found."""
    return products.get(slug)

# Con Union (tipos múltiples)
def process_order(channel: Literal["online", "store"]) -> OrderSummary:
    """Process order from sales channel."""
    pass

# Con Generic
from typing import Generic, TypeVar

T = TypeVar("T")

class Response(BaseModel, Generic[T]):
    data: T
    message: str
```

### ✅ Docstrings

**Formato: Google-style**
```python
def calculate_discount(
    items: list[OrderItem],
    apply_loyalty: bool = False,
) -> float:
    """
    Calculate total discount for order items.
    
    Considers active promotions and applies loyalty discount if customer
    has sufficient points.
    
    Args:
        items: List of items in the order
        apply_loyalty: Whether to apply customer loyalty discount
        
    Returns:
        Total discount amount in MXN
        
    Raises:
        ValueError: If items list is empty
        InsufficientPointsError: If loyalty discount requested but insufficient points
        
    Example:
        >>> items = [OrderItem(product_id="p1", qty=2, price=100)]
        >>> calculate_discount(items, apply_loyalty=False)
        0.0
    """
    if not items:
        raise ValueError("Items list cannot be empty")
    
    # Implementation...
    return discount
```

### ✅ Clases y Métodos

**Pattern: Inyección de dependencias en `__init__`**
```python
class CatalogService:
    """Service para gestión de catálogo de productos."""
    
    def __init__(self, repository: EcommerceRepository):
        """Initialize service with repository dependency.
        
        Args:
            repository: Data access implementation
        """
        self.repository = repository
    
    def list_products(self) -> list[ProductSummary]:
        """List all products from repository."""
        products = self.repository.list_products()
        return [ProductSummary.from_domain(p) for p in products]
    
    def get_product(self, slug: str) -> ProductDetail:
        """Get product by slug.
        
        Args:
            slug: Product slug (URL-friendly identifier)
            
        Returns:
            Product detail with variants
            
        Raises:
            ProductNotFoundError: If product doesn't exist
        """
        product = self.repository.get_product(slug)
        
        if not product:
            raise ProductNotFoundError(f"Product {slug} not found")
        
        return product
```

### ✅ Enums para Valores Fijos

```python
from enum import Enum

class SalesChannel(str, Enum):
    """Sales channel type."""
    ONLINE = "online"
    STORE = "store"

class OrderStatus(str, Enum):
    """Order processing status."""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class PromotionType(str, Enum):
    """Type of promotion discount."""
    PERCENTAGE = "percentage"
    FIXED = "fixed"
    COMBO = "combo"

# Uso en API
@router.get("/orders")
def list_orders(
    status: OrderStatus | None = None,
    channel: SalesChannel | None = None,
):
    """List orders with optional filters."""
    # ...
```

### ✅ FastAPI Routers

**Estructura de router:**
```python
# apps/api/app/routers/products.py
from fastapi import APIRouter, Depends, HTTPException, Query

from app.domain import ProductDetail, ProductSummary
from app.services.catalog_service import CatalogService
from app.services.dependencies import get_catalog_service

router = APIRouter(
    prefix="/products",
    tags=["products"],
    responses={404: {"description": "Product not found"}},
)

@router.get(
    "",
    response_model=list[ProductSummary],
    summary="List all products",
    description="Get paginated list of available products",
)
def list_products(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(20, ge=1, le=100, description="Max items to return"),
    category: str | None = Query(None, description="Filter by category slug"),
    service: CatalogService = Depends(get_catalog_service),
) -> list[ProductSummary]:
    """List products with pagination and optional filters."""
    try:
        return service.list_products(skip=skip, limit=limit, category=category)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get(
    "/{product_slug}",
    response_model=ProductDetail,
    summary="Get product details",
)
def get_product(
    product_slug: str = Query(..., description="Product slug (URL-friendly ID)"),
    service: CatalogService = Depends(get_catalog_service),
) -> ProductDetail:
    """Get detailed information about a product including variants."""
    try:
        product = service.get_product(product_slug)
        return product
    except ProductNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

**Reglas:**
- Siempre usar `response_model` para validación output
- Usar `Query()` para documentar parámetros
- Usar `Depends()` para inyectar servicios
- Capturar excepciones específicas primero
- Retornar status codes adecuados

### ✅ Manejo de Errores

**Excepciones personalizadas:**
```python
# apps/api/app/exceptions.py
class ReWoException(Exception):
    """Base exception for ReWo API."""
    
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(message)

class ProductNotFoundError(ReWoException):
    def __init__(self, product_id: str):
        super().__init__(
            f"Product {product_id} not found",
            status_code=404
        )

class InsufficientStockError(ReWoException):
    def __init__(self, variant_id: str, requested: int, available: int):
        super().__init__(
            f"Insufficient stock for {variant_id}: "
            f"requested {requested}, available {available}",
            status_code=409
        )

class UnauthorizedError(ReWoException):
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(message, status_code=401)

# Exception handlers
@app.exception_handler(ReWoException)
async def rewo_exception_handler(request: Request, exc: ReWoException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.message,
            "status_code": exc.status_code,
        }
    )
```

### ✅ Pydantic Models

```python
from pydantic import BaseModel, Field, validator

class ProductCreateRequest(BaseModel):
    """Request model for creating a product."""
    
    name: str = Field(..., min_length=1, max_length=200, description="Product name")
    slug: str = Field(..., min_length=1, max_length=100, regex="^[a-z0-9-]+$")
    description: str = Field(default="", max_length=2000)
    category_id: str
    supplier_id: str | None = None
    price_base: float = Field(..., gt=0, description="Base price in MXN")
    sustainability_label: str | None = None
    
    @validator("slug")
    def slug_must_be_lowercase(cls, v):
        if v != v.lower():
            raise ValueError("slug must be lowercase")
        return v
    
    class Config:
        example = {
            "name": "Organic Cotton T-Shirt",
            "slug": "organic-cotton-tshirt",
            "category_id": "cat-1",
            "price_base": 499.99,
        }

# Response
class ProductDetailResponse(BaseModel):
    id: str
    name: str
    slug: str
    variants: list[ProductVariantResponse]
    
    class Config:
        # Permitir tipos alternativos (db objects, dataclasses)
        arbitrary_types_allowed = True
```

---

## TypeScript / React

### ✅ Imports y Exports

```typescript
// Orden de imports
import React, { useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";

// UI components
import { Button } from "./components/Button";
import { Modal } from "./components/Modal";

// Types
import type { Product, ProductVariant } from "../data/types";

// APIs y utils
import { apiCall } from "../lib/api";
import { formatPrice } from "../lib/utils";

// Styles
import styles from "./ProductDetail.module.css";

// Export
export function ProductDetailPage() {
  return <div>{/* ... */}</div>;
}
```

### ✅ Types y Interfaces

```typescript
// types.ts - Centralizar todos los tipos
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: Category;
  price_base: number;
  variants: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
  price: number;
}

export interface CartItem {
  variantId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  createdAt: Date;
}

// Para funciones component props
interface ProductDetailPageProps {
  productSlug?: string;
}

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  children: React.ReactNode;
}
```

### ✅ Components

**Componentes funcionales con tipos:**
```typescript
// components/Button.tsx
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  loading = false,
  children,
  ...props
}: ButtonProps): JSX.Element {
  return (
    <button
      className={`btn btn-${variant} ${loading ? "opacity-50" : ""}`}
      disabled={loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
```

**Context providers:**
```typescript
// components/CartContext.tsx
interface CartContextType {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = React.createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("ecowear-cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("ecowear-cart", JSON.stringify(items));
  }, [items]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
```

### ✅ Pages

```typescript
// pages/ProductDetailPage.tsx
export function ProductDetailPage(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    loadProduct();
  }, [slug]);

  async function loadProduct(): Promise<void> {
    if (!slug) return;

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall<Product>(`/products/${slug}`);
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading product");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <VariantSelector
        variants={product.variants}
        onSelect={(variant) =>
          addItem({
            variantId: variant.id,
            quantity: 1,
            price: variant.price,
            name: product.name,
          })
        }
      />
    </div>
  );
}
```

### ✅ Custom Hooks

```typescript
// hooks/useAuth.ts
interface AuthUser {
  id: string;
  email: string;
  role: "client" | "admin";
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("auth_token");
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  async function validateToken(token: string): Promise<void> {
    try {
      // Decode JWT o validar contra backend
      const decoded = decodeJWT(token);
      setUser(decoded as AuthUser);
    } catch (err) {
      localStorage.removeItem("auth_token");
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<void> {
    const response = await apiCall<{ access_token: string; user: AuthUser }>(
      "/auth/login/client",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );

    localStorage.setItem("auth_token", response.access_token);
    setUser(response.user);
  }

  function logout(): void {
    localStorage.removeItem("auth_token");
    setUser(null);
  }

  return {
    user,
    loading,
    isLoggedIn: !!user,
    isAdmin: user?.role === "admin",
    login,
    logout,
  };
}

// hooks/useFetch.ts
export function useFetch<T>(
  url: string,
  options?: RequestInit
): { data: T | null; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiCall<T>(url, options);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options]);

  return { data, loading, error };
}
```

### ✅ Styling

```typescript
// Usar Tailwind utilities
import { useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="p-4 border rounded-lg hover:shadow-lg transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={product.image}
        alt={product.name}
        className={`w-full h-64 object-cover rounded ${
          isHovered ? "scale-105" : ""
        } transition-transform`}
      />
      <h3 className="mt-4 font-semibold text-lg">{product.name}</h3>
      <p className="text-green-600 font-bold">${formatPrice(product.price)}</p>
    </div>
  );
}
```

---

## SQL / Migraciones

### ✅ Estructura de Migraciones

```sql
-- supabase/migrations/004_add_order_notes.sql
-- Migration: Add order notes field
-- Created: 2026-04-16
-- Purpose: Allow customers to add notes to orders

BEGIN;

-- Add column
ALTER TABLE orders ADD COLUMN notes TEXT DEFAULT NULL;

-- Add index if needed
CREATE INDEX idx_orders_notes ON orders USING GIN(to_tsvector('spanish', notes));

-- Add comment
COMMENT ON COLUMN orders.notes IS 'Customer notes for the order';

COMMIT;
```

**Reglas:**
- Cada migration en archivo separado: `###_description.sql`
- Incluir `BEGIN; ... COMMIT;`
- Documentar propósito en comentario
- Usar índices para campos que se busquen
- Siempre hacer `DOWN` (rollback) si es posible

### ✅ Naming Conventions

```sql
-- Tablas: snake_case plural
CREATE TABLE products ( ... );
CREATE TABLE product_variants ( ... );

-- Columnas: snake_case
ALTER TABLE products ADD COLUMN sustainability_label VARCHAR(50);

-- Índices: idx_tablename_column
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- Foreign keys: fk_parent_child
ALTER TABLE products ADD CONSTRAINT fk_products_suppliers
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id);

-- Enums: UPPERCASE
CREATE TYPE order_status AS ENUM('pending', 'confirmed', 'shipped', 'delivered');

-- Vistas: v_descriptive_name
CREATE VIEW v_sales_summary AS
  SELECT ...;
```

### ✅ Timestamps y Valores por Defecto

```sql
-- Siempre agregar timestamps
ALTER TABLE products ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE products ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Boolean con valor por defecto
ALTER TABLE promotions ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

-- Números con restricciones
ALTER TABLE product_variants ADD COLUMN stock INT CHECK (stock >= 0);
ALTER TABLE orders ADD COLUMN total DECIMAL(10, 2) CHECK (total >= 0);

-- Strings con restricciones
ALTER TABLE categories ADD COLUMN slug VARCHAR(100) NOT NULL UNIQUE;
```

---

## Commits y Versionado

### ✅ Conventional Commits

**Formato:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Tipos:**
- `feat`: Nueva funcionalidad
- `fix`: Bug fix
- `docs`: Cambios a documentación
- `style`: Cambios que no afectan funcionalidad (formatting)
- `refactor`: Refactorización sin cambio de funcionalidad
- `perf`: Mejora de performance
- `test`: Agregar o actualizar tests
- `chore`: Cambios build, deps, etc

**Ejemplos:**
```
feat(checkout): implement loyalty points calculation
- Calculate points based on subtotal
- Apply 1 point per $100 spent
- Show points earned in order summary

Closes #123

feat(admin): add product bulk import from CSV

fix(cart): prevent negative quantities
- Validate quantity >= 1 before adding
- Show error message to user

Resolves #456

docs(architecture): update database schema documentation

refactor(services): extract promotion logic to separate service
- Move discount calculation to PromotionService
- Add comprehensive unit tests
- Update ARCHITECTURE.md
```

### ✅ Versionado Semántico

```
MAJOR.MINOR.PATCH

- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

Ejemplos:
0.1.0 - Initial release
0.2.0 - Add loyalty points feature
0.2.1 - Fix discount calculation bug
1.0.0 - Production release
```

---

## Review Checklist

Usar antes de hacer commit:

### Backend (Python)

- [ ] Código sigue PEP 8 (black, flake8 passan)
- [ ] Type hints en todas las funciones
- [ ] Docstrings en funciones/clases públicas
- [ ] Excepciones personalizadas usadas
- [ ] Tests escritos y pasando
- [ ] No hay prints (usar logging)
- [ ] Inyección de dependencias correcta
- [ ] No hay hardcoded secrets o keys
- [ ] Response models validados

### Frontend (TypeScript/React)

- [ ] Código usa TypeScript (no `any`)
- [ ] Componentes son funcionales y reutilizables
- [ ] Custom hooks extraído si lógica se repite
- [ ] Context usado apropiadamente (no para estado local)
- [ ] Manejo de errores y loading states
- [ ] localStorage usado solo para persistencia necesaria
- [ ] No hay console.log en producción
- [ ] Accesibilidad básica (labels, alt text, etc)
- [ ] Mobile responsive

### General

- [ ] Commit message sigue Conventional Commits
- [ ] Branch name es descriptivo (`feat/loyalty-points`, `fix/cart-bug`)
- [ ] No hay cambios no relacionados
- [ ] README actualizado si necesario
- [ ] ARCHITECTURE.md actualizado si cambios estructurales

