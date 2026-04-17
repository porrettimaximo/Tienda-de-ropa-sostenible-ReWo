# Backend Tests (Pytest)

Este directorio contiene tests unitarios e integración para la API de ReWo usando **Pytest**.

## Estructura

```
tests/
├── conftest.py           # Fixtures compartidas (productos, promociones, etc)
├── test_promotions.py    # 13 tests - Lógica de aplicación de promociones
├── test_checkout.py      # 24 tests - Validación de stock, lealtad, totales
└── __init__.py
```

## Tests Incluidos

### 1. **test_promotions.py** - Aplicación de Promociones (13 tests)

Valida la función `apply_best_promotion()` con todos los tipos de descuento:

| Test | Descripción |
|------|-------------|
| `test_no_promotions_returns_none` | Sin promociones → None |
| `test_fixed_discount_applied` | Descuento fijo: $200 |
| `test_fixed_discount_capped_by_subtotal` | Descuento fijo no supera subtotal |
| `test_percentage_discount_applied` | Descuento %: 10% de subtotal |
| `test_percentage_discount_capped_by_subtotal` | % capped by subtotal |
| `test_combo_promotion_requires_min_subtotal` | Combo requiere subtotal ≥ $5000 |
| `test_combo_promotion_requires_distinct_products` | Combo requiere 2+ productos |
| `test_combo_promotion_applied_correctly` | Combo $350 cuando aplica |
| `test_best_promotion_selected` | Selecciona mayor descuento |
| `test_best_promotion_combo_wins` | Combo gana si es mayor |
| `test_invalid_promotion_type_ignored` | Tipos inválidos ignorados |
| `test_zero_discount_promotion_ignored` | Descuentos 0 ignorados |
| `test_multiple_combo_products` | Combo con múltiples productos |

### 2. **test_checkout.py** - Flujo de Checkout (24 tests)

#### 2.1 Stock Validation (4 tests)
- Stock suficiente ✓
- Stock insuficiente ✗
- Cantidad exacta al stock ✓
- Cantidad > stock ✗

#### 2.2 Promotion Application (4 tests)
- Fijo: $1000 - $200 = $800
- %: $1000 - 10% = $900
- Combo: $6000 - $350 = $5650 (si aplica)

#### 2.3 Loyalty Points (9 tests)
- **Earn**: 1 punto por $10
- **Redeem**: 500 puntos = $100
  - Múltiples bloques: 1500 puntos = $300
  - Validación: solo bloques de 500
  - Capped by total (no supera orden total)
- **Calculation**: Post-discounts

#### 2.4 Request Validation (4 tests)
- Items requeridos
- Quantity > 0
- Invoice data (RFC, business name)
- Store metadata (store_name, seller, payment)

#### 2.5 Integration Tests (3 tests)
- Flow completo: items + promo + loyalty
- Combo checkout con múltiples descuentos

## Ejecutar Tests

### Todos los tests
```bash
cd apps/api
pytest tests/ -v
```

### Tests específicos
```bash
# Solo promotions
pytest tests/test_promotions.py -v

# Solo checkout
pytest tests/test_checkout.py -v

# Test específico
pytest tests/test_checkout.py::TestLoyaltyPointsCalculation::test_loyalty_points_earned -v
```

### Con coverage
```bash
pip install pytest-cov
pytest tests/ --cov=app --cov-report=html
```

## Fixtures Disponibles

En `conftest.py`:

```python
mock_product           # Producto con 3 variantes
mock_second_product    # Segundo producto para combos
mock_fixed_promotion   # Descuento fijo $200
mock_percentage_promotion  # Descuento 10%
mock_combo_promotion   # Combo $350
mock_repository        # Mock repository
```

## Resultados

✅ **37 tests passing** (100%)
- Tiempo: ~0.3 segundos
- Cobertura: Promociones, Loyalty, Checkout

## Próximas Mejoras

- [ ] E2E tests (Cypress/Playwright)
- [ ] Mock Supabase client para tests aislados
- [ ] Performance tests para checkout
- [ ] Stress tests para puntos de lealtad
