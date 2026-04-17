# 👥 Historias de Usuario - ReWo

Este documento detalla los requerimientos funcionales del sistema bajo el estándar de Historias de Usuario (HU), incluyendo criterios de aceptación para su validación técnica y funcional.

---

## 🛍️ Módulo: E-commerce (Cliente)

### HU-01: Navegación y Catálogo Ético
**Como** cliente interesado en la moda sostenible,  
**quiero** explorar el catálogo de productos con información sobre su origen y materiales,  
**para** realizar compras alineadas con mis valores de consumo responsable.

**Criterios de Aceptación:**
*   El catálogo debe mostrar una lista de productos activos con su precio e imagen.
*   Cada producto debe permitir la selección de variantes (Talla y Color) según el stock disponible.
*   El diseño debe ser totalmente responsive (Mobile-first).

### HU-02: Acumulación de Puntos Eco
**Como** cliente registrado en la plataforma,  
**quiero** acumular puntos automáticamente por cada compra realizada,  
**para** obtener beneficios por mi lealtad a la marca.

**Criterios de Aceptación:**
*   El sistema debe otorgar 1 Punto Eco por cada $10 MXN de compra neta.
*   Los puntos deben ser visibles en el perfil del usuario inmediatamente después de confirmada la compra.
*   El historial de puntos debe ser accesible desde la sección "Mi Cuenta".

### HU-03: Canje de Beneficios en Checkout
**Como** cliente frecuente con puntos acumulados,  
**quiero** aplicar mis puntos como descuento directo en el proceso de pago,  
**para** reducir el costo de mi compra actual.

**Criterios de Aceptación:**
*   El canje se realizará en bloques de 500 puntos, equivalentes a $100 MXN de descuento.
*   El sistema debe validar que el usuario tenga los puntos suficientes antes de permitir el canje.
*   El descuento debe verse reflejado en el desglose del total antes de confirmar el pago.

### HU-04: Aplicación Automática de Combos
**Como** comprador que busca optimizar su inversión,  
**quiero** que el sistema aplique descuentos automáticos al comprar sets de productos,  
**para** ahorrar dinero sin necesidad de gestionar cupones manuales.

**Criterios de Aceptación:**
*   El motor de promociones debe evaluar el contenido del carrito en tiempo real.
*   Al cumplir con las reglas de un combo (ej. 3 prendas básicas), se debe aplicar el descuento más favorable.
*   El nombre del combo aplicado debe aparecer claramente en el resumen del pedido.

### HU-05: Incentivo de Conversión para Invitados
**Como** visitante no registrado,  
**quiero** ver el potencial de puntos que ganaría con mi compra actual,  
**para** motivarme a crear una cuenta y formalizar mi relación con la marca.

**Criterios de Aceptación:**
*   El checkout debe mostrar un mensaje dinámico indicando los puntos que se ganarían con el total actual.
*   Debe existir un acceso directo al registro que conserve la intención de compra.

---

## 🛠️ Módulo: Panel de Administración (Operativo)

### HU-06: Monitoreo Estratégico (KPIs)
**Como** administrador del negocio,  
**quiero** visualizar indicadores de rendimiento (Ventas, Ticket Promedio, Unidades),  
**para** evaluar la salud financiera de la operación online y física.

**Criterios de Aceptación:**
*   El dashboard debe permitir filtrar datos por canal (Online/Tienda) y rango de fechas.
*   Los datos deben actualizarse automáticamente al cargar el panel.
*   Se debe incluir un reporte rápido de ventas por variante (Talla/Color).

### HU-07: Gestión Centralizada de Catálogo
**Como** administrador de inventario,  
**quiero** crear, editar y dar de baja (Soft Delete) productos y sus variantes,  
**para** mantener la oferta comercial actualizada sin perder integridad histórica.

**Criterios de Aceptación:**
*   El sistema debe permitir la gestión de múltiples variantes por producto.
*   Los cambios en el catálogo deben reflejarse en tiempo real en la tienda online.
*   Debe existir validación de campos obligatorios para asegurar la calidad de la información.

### HU-08: Configuración de Promociones y Combos
**Como** responsable de marketing,  
**quiero** configurar las reglas de los combos (mínimo de piezas, descuento, vigencia),  
**para** ejecutar campañas comerciales dinámicas.

**Criterios de Aceptación:**
*   Se debe poder definir si el descuento es fijo o porcentual.
*   El sistema debe permitir activar/desactivar promociones con un solo clic.
*   Se deben validar las fechas de vigencia para evitar aplicaciones erróneas.

### HU-09: Registro de Ventas Omnicanal
**Como** vendedor en sucursal física,  
**quiero** registrar ventas presenciales directamente en el panel administrativo,  
**para** mantener el inventario sincronizado y unificar los reportes comerciales.

**Criterios de Aceptación:**
*   El registro debe permitir seleccionar productos del catálogo existente.
*   Debe existir la opción de asociar un cliente para otorgar puntos eco.
*   La venta debe impactar inmediatamente en los KPIs globales de la empresa.
