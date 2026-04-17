# 🎬 Guion de Video Técnico (Video 2) - ReWo

Este video está diseñado para un perfil técnico/evaluador, enfocándose en la robustez de la arquitectura y el valor comercial de las innovaciones implementadas.

---

## 1. Introducción y Stack Tecnológico (1m)
*   **Apertura:** "Bienvenidos a la inmersión técnica de ReWo. Nuestra meta fue construir una plataforma escalable que combine la flexibilidad de un e-commerce moderno con la robustez de una arquitectura empresarial."
*   **Stack:** Mencionar el uso de **FastAPI** (Python) por su tipado estático y velocidad, **React 18** con **Vite** para un frontend ultra-reactivo, y **Supabase** como infraestructura de datos y autenticación.
*   **Visión General:** Mostrar brevemente el árbol de directorios resaltando la separación de `apps/api` y `apps/web`.

## 2. Decisiones Técnicas y Arquitectura (1m 30s)
*   **Arquitectura en Capas:** "Implementamos una arquitectura dividida en Routers, Services y Repositories. Esto nos permite aislar la lógica de negocio de la persistencia de datos."
*   **Patrón Repository:** "Utilizamos protocolos (interfaces) para nuestros repositorios. Esto significa que si mañana decidimos cambiar Supabase por otra base de datos, los servicios no sufren cambios. Es diseño a prueba de futuro."
*   **Validación con Pydantic:** "Cada dato que entra o sale del backend está validado por esquemas de Pydantic, garantizando integridad total y reduciendo errores en runtime."

## 3. Desafíos Superados y Uso de IA (1m)
*   **Desafíos:** "Uno de los mayores retos fue la sincronización del motor de promociones. Necesitábamos que el frontend diera una respuesta inmediata (UX) pero que el backend tuviera la última palabra para evitar inconsistencias."
*   **IA como Catalizador:** "Aprovechamos la IA no solo para acelerar el desarrollo del código base, sino para la generación de activos de marca (logos, banners) y la optimización de algoritmos de cálculo de descuentos dinámicos."

## 4. Funcionalidades Adicionales e Impacto Comercial (1m 30s)
*Aquí es donde demostramos el "Plus" del proyecto.*

### A. Motor de Promociones Dinámico (Combos)
*   **Qué es:** Un sistema que evalúa automáticamente el carrito y aplica descuentos por conjuntos de productos.
*   **Utilidad Comercial:** "Aumenta el **AOV (Average Order Value)**. El usuario se siente motivado a llevar 'el set completo' para desbloquear el ahorro."
*   **Implementación:** "Un servicio especializado evalúa reglas de cantidad mínima, subtotal y vigencia, devolviendo el mejor descuento posible de forma atómica."

### B. Sistema de Lealtad (Puntos Eco)
*   **Qué es:** Fidelización basada en el impacto (1 punto por cada $10 MXN).
*   **Utilidad Comercial:** "Mejora el **LTV (Lifetime Value)**. Creamos un incentivo para que el usuario regrese. Además, la visualización de 'puntos por ganar' para invitados reduce el abandono del carrito."
*   **Implementación:** "Integración nativa con el Checkout que permite canjes en bloques de 500 puntos, con validación de saldos en tiempo real vía Supabase."

## 5. Conclusión (30s)
*   **Resumen:** "ReWo demuestra que es posible unir sostenibilidad y alta tecnología. Es una app 100% responsive, instalable como PWA y lista para escalar comercialmente."
*   **Cierre:** "Gracias por acompañarnos en este recorrido técnico."
