# Diagramas de Arquitectura - ReWo

## 1. Arquitectura General (3 Capas)

```mermaid
graph TB
    subgraph Client["🌐 Cliente"]
        Browser["Browser/Mobile"]
    end
    
    subgraph Frontend["📱 Frontend (React + TypeScript)"]
        Pages["Pages<br/>(ProductDetail, Admin, etc)"]
        Components["Components<br/>(CartContext, SiteShell)"]
        State["State<br/>(Context + localStorage)"]
        API_Client["API Client<br/>(lib/api.ts)"]
    end
    
    subgraph Backend["⚙️ Backend (FastAPI + Python)"]
        Routers["HTTP Layer<br/>(routers/)"]
        Services["Business Logic<br/>(services/)"]
        Repos["Data Access<br/>(repositories/)"]
    end
    
    subgraph Database["🗄️ Database"]
        Supabase["PostgreSQL<br/>(Supabase)"]
    end
    
    Browser -->|HTTP Requests| Pages
    Pages -->|State| Components
    Components -->|API Call| API_Client
    API_Client -->|REST| Routers
    Routers -->|Inject| Services
    Services -->|Query| Repos
    Repos -->|SQL| Supabase
    Supabase -->|Rows| Repos
    Repos -->|Domain| Services
    Services -->|Response| Routers
    Routers -->|JSON| API_Client
    API_Client -->|Parse| State
    State -->|Re-render| Components
    Components -->|Display| Pages
    Pages -->|HTML| Browser
```

## 2. Backend - Capas (Layered Architecture)

```mermaid
graph TD
    subgraph HTTP["🔴 API Layer (HTTP)"]
        R1["GET /products"]
        R2["POST /checkout"]
        R3["PUT /admin/products/{slug}"]
        R4["GET /admin/promotions"]
    end
    
    subgraph BIZ["🟠 Business Logic Layer (Services)"]
        S1["CatalogService"]
        S2["SalesService"]
        S3["PromotionsService"]
        S4["ReportingService"]
        S5["AuthService"]
    end
    
    subgraph DATA["🟡 Data Access Layer (Repositories)"]
        REP["EcommerceRepository<br/>(Protocol)"]
        REPO1["MemoryRepository"]
        REPO2["SupabaseRepository"]
        REPO3["HybridRepository"]
    end
    
    subgraph EXTERNAL["🟢 External Services"]
        DB["PostgreSQL<br/>(Supabase)"]
        AUTH["Supabase Auth"]
    end
    
    R1 --> S1
    R2 --> S2
    R3 --> S1
    R4 --> S3
    
    S1 -->|Implements| REP
    S2 -->|Implements| REP
    S3 -->|Implements| REP
    S4 -->|Implements| REP
    S5 -->|Implements| REP
    
    REPO1 -->|Implements| REP
    REPO2 -->|Implements| REP
    REPO3 -->|Implements| REP
    
    REPO2 -->|SQL Query| DB
    S5 -->|Auth Call| AUTH
    
    style HTTP fill:#ffe6e6
    style BIZ fill:#fff4e6
    style DATA fill:#fffbe6
    style EXTERNAL fill:#e6ffe6
```

## 3. Flujo de una Petición GET /products

```mermaid
sequenceDiagram
    participant Browser
    participant Router as products.py<br/>Router
    participant Service as CatalogService
    participant Repo as Repository
    participant DB as PostgreSQL
    
    Browser->>Router: GET /products?skip=0&limit=20
    activate Router
    
    Router->>Router: Valida params
    Router->>Router: Inyecta CatalogService
    
    Router->>Service: list_products(skip=0, limit=20)
    activate Service
    
    Service->>Repo: list_products()
    activate Repo
    
    Repo->>DB: SELECT * FROM products LIMIT 20
    DB-->>Repo: Rows
    Repo-->>Service: [ProductSummary]
    deactivate Repo
    
    Service->>Service: Aplicar filtros/ordenamiento
    Service-->>Router: [ProductSummary]
    deactivate Service
    
    Router-->>Browser: JSON Response (200)
    deactivate Router
```

## 4. Flujo de Checkout (POST /checkout)

```mermaid
sequenceDiagram
    participant Client as React<br/>CheckoutPage
    participant API as API Client
    participant Router as sales.py<br/>Router
    participant Service as SalesService
    participant PromoSvc as PromotionsService
    participant Repo as Repository
    participant DB as PostgreSQL
    
    Client->>API: POST /checkout<br/>{items, customer_id, ...}
    
    activate Router
    Router->>Router: Valida CheckoutRequest
    Router->>Service: checkout(request)
    
    activate Service
    Service->>Service: Validar stock (each item)
    
    Service->>PromoSvc: apply_promotions(items)
    activate PromoSvc
    PromoSvc->>Repo: list_promotions(active_only=true)
    Repo->>DB: SELECT * FROM promotions WHERE is_active=true
    DB-->>Repo: [Promotion]
    Repo-->>PromoSvc: Promociones
    PromoSvc->>PromoSvc: Calcular descuento
    PromoSvc-->>Service: discount_amount
    deactivate PromoSvc
    
    Service->>Service: Calcular puntos lealtad
    Service->>Repo: create_order({...})
    activate Repo
    Repo->>DB: INSERT INTO orders
    Repo->>DB: INSERT INTO order_items
    Repo->>DB: UPDATE product_variants SET stock = stock - qty
    DB-->>Repo: Order creada
    Repo-->>Service: OrderSummary
    deactivate Repo
    
    Service-->>Router: OrderSummary
    deactivate Service
    
    Router-->>API: {order_id, total, ...}
    deactivate Router
    
    API-->>Client: JSON Response
    
    Client->>Client: Guardar order_id
    Client->>Client: CartContext.clearCart()
    Client->>Client: Navigate /orders/{id}
```

## 5. Autenticación y Autorización

```mermaid
graph TD
    subgraph Auth["🔐 Autenticación"]
        A1["Cliente Submit login"]
        A2["POST /auth/login/client"]
        A3["Valida contra Supabase Auth"]
        A4["Retorna access_token + user"]
        A5["Frontend guardar token en localStorage"]
    end
    
    subgraph Protected["🛡️ Request Protegido"]
        P1["GET /admin/products"]
        P2["Header: Authorization: Bearer token"]
        P3["get_current_user dependency"]
        P4["Decodifica JWT"]
        P5["Valida signature con SECRET"]
        P6["Retorna AuthUser"]
    end
    
    subgraph AdminOnly["👑 Admin Only"]
        AD1["require_admin dependency"]
        AD2["Verifica user.role == admin"]
        AD3["Si ✅: continue request"]
        AD4["Si ❌: 403 Forbidden"]
    end
    
    A1 --> A2
    A2 --> A3
    A3 --> A4
    A4 --> A5
    
    A5 -->|En siguiente request| P1
    P1 --> P2
    P2 --> P3
    P3 --> P4
    P4 --> P5
    P5 --> P6
    
    P6 --> AD1
    AD1 --> AD2
    AD2 -->|✅| AD3
    AD2 -->|❌| AD4
    
    style Auth fill:#e6f3ff
    style Protected fill:#fff0f5
    style AdminOnly fill:#ffe6f0
```

## 6. Repositorio Pattern (Abstracción de BD)

```mermaid
graph TB
    subgraph Services["Services"]
        S1["CatalogService"]
        S2["SalesService"]
        S3["PromotionsService"]
    end
    
    subgraph Interface["Protocol (Interface)"]
        PROTO["EcommerceRepository<br/>- list_products()<br/>- get_product()<br/>- checkout()<br/>- create_order()<br/>- etc..."]
    end
    
    subgraph Implementations["Implementaciones"]
        MEM["MemoryRepository<br/>(datos en RAM)"]
        SUP["SupabaseRepository<br/>(PostgreSQL)"]
        HYB["HybridRepository<br/>(ambas)"]
    end
    
    subgraph Backends["Backends"]
        RAM["RAM (testing)"]
        PG["PostgreSQL<br/>(Supabase)"]
    end
    
    S1 -->|Depende de| PROTO
    S2 -->|Depende de| PROTO
    S3 -->|Depende de| PROTO
    
    PROTO -->|Implementa| MEM
    PROTO -->|Implementa| SUP
    PROTO -->|Implementa| HYB
    
    MEM --> RAM
    SUP --> PG
    HYB -->|Combina| MEM
    HYB -->|Combina| SUP
    
    style PROTO fill:#fff9c4
    style MEM fill:#c8e6c9
    style SUP fill:#b3e5fc
    style HYB fill:#ffe0b2
```

## 7. Frontend - Routing y State

```mermaid
graph TB
    subgraph Public["Rutas Públicas"]
        P1["/ - HomePage"]
        P2["/collections - CollectionPage"]
        P3["/products/:slug - ProductDetailPage"]
        P4["/cart - CartPage"]
        P5["/checkout - CheckoutPage"]
        P6["/login - LoginPage"]
        P7["/combos - CombosPage"]
    end
    
    subgraph Private["Rutas Privadas (Cliente)"]
        PR1["/account - AccountPage"]
        PR2["/profile - ProfilePage"]
        PR3["/orders/:id - OrderDetailPage"]
    end
    
    subgraph Admin["Rutas Admin"]
        AD1["/admin/login - AdminLoginPage"]
        AD2["/admin - AdminDashboardPage"]
        AD3["/admin/catalog - AdminCatalogPage"]
        AD4["/admin/promotions - AdminPromotionsPage"]
        AD5["/admin/suppliers - AdminSuppliersPage"]
        AD6["/admin/store-sales - StoreSalePage"]
    end
    
    subgraph State["State Management"]
        CART["CartContext<br/>- items[]<br/>- addItem()<br/>- removeItem()<br/>- total"]
        LOCAL["localStorage<br/>- auth_token<br/>- ecowear-cart"]
    end
    
    P3 --> CART
    P4 --> CART
    P5 --> CART
    
    P6 --> LOCAL
    AD1 --> LOCAL
    
    CART --> LOCAL
    
    style Public fill:#e1f5fe
    style Private fill:#f3e5f5
    style Admin fill:#fff3e0
    style State fill:#fce4ec
```

## 8. Base de Datos - Modelo Relacional

```mermaid
erDiagram
    CUSTOMERS ||--o{ ORDERS : places
    CUSTOMERS ||--o{ LOYALTY_MOVEMENTS : earns
    SUPPLIERS ||--o{ PRODUCTS : supplies
    CATEGORIES ||--o{ PRODUCTS : contains
    PRODUCTS ||--o{ PRODUCT_VARIANTS : has
    PRODUCTS ||--o{ PROMOTION_PRODUCTS : "has many"
    PROMOTIONS ||--o{ PROMOTION_PRODUCTS : targets
    ORDERS ||--o{ ORDER_ITEMS : contains
    PRODUCT_VARIANTS ||--o{ ORDER_ITEMS : "in order"
    
    CUSTOMERS {
        string id PK
        string full_name
        string email UK
        string phone
        int loyalty_points
        timestamp created_at
    }
    
    PRODUCTS {
        string id PK
        string slug UK
        string name
        string category_id FK
        string supplier_id FK
        float price_base
        string sustainability_label
    }
    
    PRODUCT_VARIANTS {
        string id PK
        string product_id FK
        string sku UK
        string size
        string color
        int stock
        float price_override
    }
    
    PROMOTIONS {
        string id PK
        string name
        string type
        float discount_value
        timestamp starts_at
        timestamp ends_at
        boolean is_active
    }
    
    ORDERS {
        string id PK
        string customer_id FK
        string sales_channel
        float subtotal
        float promotion_discount
        float loyalty_discount
        float total
        timestamp created_at
    }
    
    ORDER_ITEMS {
        string id PK
        string order_id FK
        string variant_id FK
        int quantity
        float unit_price
    }
    
    LOYALTY_MOVEMENTS {
        string id PK
        string customer_id FK
        int points_amount
        string movement_type
        timestamp created_at
        timestamp expires_at
    }
```

## 9. Flujo de Error

```mermaid
graph TD
    subgraph Request["Request"]
        R1["Cliente envía request"]
    end
    
    subgraph Validate["Validación"]
        V1["¿Pydantic válido?"]
        V2["❌ ValidationError"]
        V3["✅ Valid input"]
    end
    
    subgraph Business["Lógica Negocio"]
        B1["¿Stock disponible?"]
        B2["❌ InsufficientStockError"]
        B3["✅ Stock OK"]
        B4["¿Datos válidos?"]
        B5["❌ ProductNotFoundError"]
        B6["✅ Data OK"]
    end
    
    subgraph Response["Response"]
        RESP1["❌ HTTP 400<br/>{detail: validation}"]
        RESP2["❌ HTTP 409<br/>{detail: stock}"]
        RESP3["❌ HTTP 404<br/>{detail: not found}"]
        RESP4["✅ HTTP 200<br/>{data: result}"]
    end
    
    R1 --> V1
    V1 -->|No| V2 --> RESP1
    V1 -->|Sí| V3
    
    V3 --> B1
    B1 -->|No| B2 --> RESP2
    B1 -->|Sí| B3
    
    B3 --> B4
    B4 -->|No| B5 --> RESP3
    B4 -->|Sí| B6
    
    B6 --> RESP4
    
    style RESP1 fill:#ffcdd2
    style RESP2 fill:#ffcdd2
    style RESP3 fill:#ffcdd2
    style RESP4 fill:#c8e6c9
```

## 10. Deployment Pipeline (Próximo)

```mermaid
graph LR
    subgraph Dev["Desarrollo Local"]
        Code["Código"]
        Test["npm run test"]
        Lint["npm run lint"]
    end
    
    subgraph Repo["GitHub"]
        Push["git push"]
        PR["Pull Request"]
    end
    
    subgraph CI["CI/CD Pipeline"]
        Tests["✓ Tests"]
        Build["✓ Build"]
        Deploy["✓ Deploy"]
    end
    
    subgraph Prod["Producción"]
        Web["Frontend<br/>(Netlify)"]
        API["Backend<br/>(Render)"]
        DB["Database<br/>(Supabase)"]
    end
    
    Code --> Test
    Test --> Lint
    Lint --> Push
    Push --> PR
    PR --> Tests
    Tests --> Build
    Build --> Deploy
    Deploy --> Web
    Deploy --> API
    Web --> DB
    API --> DB
    
    style CI fill:#f3e5f5
    style Prod fill:#e8f5e9
```
