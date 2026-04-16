# 🎯 Arquitectura - Quick Reference

**TL;DR - La esencia de cómo funciona ReWo**

---

## 1️⃣ Las 3 Capas (Backend)

```
API Layer        → Recibe HTTP, valida estructura
   ↓
Service Layer    → Aplica reglas de negocio
   ↓
Repository Layer → Accede a base de datos
```

**Cada capa está completamente separada.** Si cambias BD, solo cambias Repository. Services no cambian.

---

## 2️⃣ Flujo: Cliente compra

```
1. Frontend: Click "Agregar al carrito" 
   → Guardar en localStorage

2. Frontend: Click "Comprar"
   → POST /checkout {items, customer_id, ...}

3. Backend Router (sales.py)
   → Valida estructura del request
   → Llama SalesService

4. SalesService
   → Valida: ¿Stock disponible?
   → Aplica promoción
   → Calcula puntos lealtad
   → Llama Repository.checkout()

5. Repository.supabase_repository.py
   → INSERT INTO orders
   → INSERT INTO order_items
   → UPDATE stock
   → Retorna OrderSummary

6. Response va back al frontend
   → Limpiar carrito (localStorage)
   → Mostrar resumen

7. BD actualizada con nueva orden
```

---

## 3️⃣ Cómo Agregar Funcionalidad Nueva

### Ejemplo: Crear endpoint GET /low-stock

**Paso 1: Router** (`apps/api/app/routers/admin.py`)
```python
@router.get("/low-stock")
def get_low_stock(
    threshold: int = Query(5),
    current_user: AuthUser = Depends(require_admin),  # ← Protección
    service: CatalogService = Depends(get_catalog_service),  # ← Inyección
):
    return service.get_low_stock(threshold)
```

**Paso 2: Service** (`apps/api/app/services/catalog_service.py`)
```python
def get_low_stock(self, threshold: int) -> list[StockAlert]:
    products = self.repository.list_product_details()
    alerts = []
    for product in products:
        for variant in product.variants:
            if variant.stock < threshold:
                alerts.append(StockAlert(...))
    return alerts
```

**Paso 3: Frontend** (`src/pages/AdminStocksPage.tsx`)
```typescript
useEffect(() => {
  apiCall<StockAlert[]>("/admin/low-stock?threshold=5")
    .then(setAlerts)
    .catch(setError);
}, []);
```

**Paso 4: Commit**
```bash
git add . && git commit -m "feat(admin): add low stock alerts"
```

---

## 4️⃣ Proteger Endpoints

**Todos los endpoints admin necesitan:**

```python
from app.security import require_admin

@router.post("/admin/products")
def create_product(
    payload: ProductCreateRequest,
    current_user: AuthUser = Depends(require_admin),  # ← Esta línea
    service: CatalogService = Depends(get_catalog_service),
):
    # Si user.role != "admin" → 403 Forbidden
    return service.create_product(payload)
```

**En frontend, guardar token:**

```typescript
// Después de login
const response = await apiCall("/auth/login/admin", {
  method: "POST",
  body: JSON.stringify({ email, password })
});

localStorage.setItem("auth_token", response.access_token);
```

**Todos los requests posteriores lo usan automáticamente** (lib/api.ts lo agrega al header).

---

## 5️⃣ Base de Datos: Patrón Repository

```
Services usan:  self.repository.list_products()

Repository es:  Protocol (interfaz abstracta)
                - list_products() → list[ProductSummary]
                - get_product(slug) → ProductDetail
                - checkout(order) → OrderSummary
                - etc

Implementaciones:
  ✓ MemoryRepository      (datos en RAM, testing)
  ✓ SupabaseRepository    (PostgreSQL real)
  ✓ HybridRepository      (combinación, transición)
```

**Beneficio**: Cambiar de MemoryRepository a Supabase sin tocar Services.

```python
# En dependencies.py
# Cambiar esta línea para usar diferente BD:
repository = HybridRepository()   # ← Cambiar aquí
# repository = SupabaseRepository()
# repository = MemoryRepository()
```

---

## 6️⃣ TypeScript: Tipos Obligatorios

```typescript
// ❌ NO HACER
const products = await fetch("/products").then(r => r.json());

// ✅ HACER
interface Product {
  id: string;
  name: string;
  price: number;
}

const products = await apiCall<Product[]>("/products");
products.forEach(p => console.log(p.name));  // IDE sabe que p.name existe
```

**Beneficio**: Errores en IDE, no en runtime.

---

## 7️⃣ Estado en Frontend (CartContext)

```
Global State (Compartir entre componentes):
  - useContext(CartContext) → items, total, addItem()
  - Sincroniza con localStorage automáticamente

Local State (Un solo componente):
  - useState(loading) → true/false mientras carga

Rules:
  ✓ Carrito global (múltiples páginas lo usan)
  ✓ Auth global (proteger rutas)
  ✗ Formulario local (no global)
  ✗ UI state (abrir/cerrar modal) - puede ser local
```

---

## 8️⃣ Manejo de Errores

**Backend**
```python
# Throw específico
if not product:
    raise ProductNotFoundError(f"Product {slug} not found")  # 404

if variant.stock < qty:
    raise InsufficientStockError(...)  # 409

# Frontend recibe JSON
{
  "detail": "Product not found",
  "status_code": 404
}
```

**Frontend**
```typescript
try {
  const product = await apiCall("/products/invalid");
} catch (error) {
  console.error(error);
  showNotification("Error loading product", "error");
}
```

---

## 9️⃣ Convenciones (IMPORTANTE)

| Elemento | Patrón | Ejemplo |
|----------|--------|---------|
| Archivos Python | `snake_case.py` | `catalog_service.py` |
| Clases Python | `PascalCase` | `CatalogService` |
| Archivos TS | `PascalCase.tsx` | `ProductDetail.tsx` |
| Funciones TS | `camelCase` | `getProductList()` |
| URLs API | kebab-case | `/admin/low-stock` |
| BD tablas | snake_case plural | `products` |
| BD columnas | snake_case | `product_id` |
| Commits | Conventional | `feat(admin): add low stock alerts` |

---

## 🔟 Checklist: Antes de Hacer Commit

- [ ] Type hints en todas las funciones (Python)
- [ ] No hay `console.log` en código (TypeScript)
- [ ] Docstring en funciones públicas
- [ ] Excepciones personalizadas usadas (no genéricas)
- [ ] Tests escritos (si funcionalidad nueva)
- [ ] `git diff` limpio (sin archivos accidentales)
- [ ] Commit message sigue patrón: `feat(scope): message`
- [ ] README/ARCHITECTURE.md actualizado

---

## 🏃 Quick Commands

```bash
# Backend
python -m uvicorn app.main:app --reload

# Frontend
npm run dev

# Ver API docs (después de iniciar backend)
http://localhost:8000/docs

# Logs
curl http://localhost:8000/health
```

---

## 🚨 Problemas Comunes

**"Error: Cannot find module app"**
```bash
cd apps/api
source venv/bin/activate
pip install -r requirements.txt
```

**"CORS error en requests"**
→ Verificar `allow_origins` en `main.py` (debe incluir `http://localhost:5173`)

**"Supabase no conecta"**
→ Backend cae a `MemoryRepository` automáticamente si `SUPABASE_URL` vacío

**"TypeScript error en IDE pero código funciona"**
→ Reiniciar VS Code

---

## 📚 Documentación Completa

- **ARCHITECTURE.md** - Diseño detallado
- **CODING-STANDARDS.md** - Convenciones
- **DEVELOPMENT-GUIDE.md** - Cómo empezar
- **ARCHITECTURE-DIAGRAMS.md** - Diagramas Mermaid

---

## ✨ Lo Más Importante

1. **Capas separadas** = fácil cambiar cosas sin romper todo
2. **Type hints** = errores en IDE, no en runtime
3. **Inyección de dependencias** = testeable, desacoplado
4. **Protocol para repositories** = cambiar BD sin tocar servicios
5. **Excepciones específicas** = mensajes claros a cliente

**→ Sigue estos 5 principios y el proyecto escala perfectamente.**
