# UTN Cinemas - Documento de Requerimientos del Sistema
**Trabajo Práctico N° 1 - Programación IV**

Este documento sintetiza la totalidad de los requerimientos funcionales y técnicos solicitados por la directiva de inversores para el desarrollo integral de la plataforma de gestión y reservas de UTN Cinemas.

---

## 1. Módulo de Cartelera y Catálogo de Películas
* **Información de Películas:** Cada película cuenta con título, sinopsis, duración en minutos, imagen/póster, restricciones etarias, formato de proyección (2D, 3D, 4D, 5D) e idioma (castellano o subtitulada).
* **Página Principal (Home):** Visualización destacada del **Top 3 de películas más vendidas**.
* **Buscador y Filtros:** Buscador integrado con filtrado por texto (nombre/sinopsis) y filtrado dinámico por **múltiples géneros** (Acción, Comedia, Ciencia Ficción, Animación, etc.).
* **Sistema de Reseñas y Calificaciones:** Los usuarios pueden calificar las películas con estrellas (1 a 5) y dejar comentarios cortos. El sistema calcula y muestra automáticamente la **puntuación promedio** de cada film antes de realizar la compra.
* **Próximamente y Preventas:** Sección de estrenos futuros con opción de **activar alertas** por notificación, y sistema de **preventa habilitada 7 días antes** del estreno con precio promocional configurable.

---

## 2. Mapa de Butacas y Sala de Cine
* **Distribución Física Estándar:** Estructura fija de 20 filas (numeradas con letras de la A a la T) y 3 columnas con distribuciones de **4, 20 y 4 butacas**, separadas por pasillos centrales.
* **Butacas Accesibles (Discapacidad):** Las filas **J y K** fueron adaptadas para personas con discapacidad, reconfigurando los bloques a **2, 10 y 2 butacas** y resaltándose visualmente de forma diferenciada.
* **Butacas VIP:** Las últimas 3 filas (**R, S y T**) están catalogadas como VIP, con un costo superior y una identificación visual clara para el cliente antes de confirmar.
* **Sincronización en Tiempo Real:** El mapa permite visualizar de forma interactiva las butacas ocupadas por otras transacciones simultáneas.

---

## 3. Proceso de Compra, Candy Bar y Cupones
* **Compra Unificada:** Los clientes pueden adquirir entradas y sumar productos del **Candy Bar** (pochoclos, gaseosas, nachos, combos especiales) para retirarlos conjuntamente utilizando el mismo código QR.
* **Registro de Usuarios Opcional:** Permite compras anónimas o mediante registro completo (mail, nombre, apellido, fecha de nacimiento, tipo de sangre, color de ojos y días de vacaciones anuales).
* **Sistema de Cupones Configurable:** 
  * Cupón de bienvenida/primera compra con porcentaje variable configurable por el administrador (por defecto 20%).
  * Cupón exclusivo del 30% OFF para usuarios mayores de 50 años.
* **Restricciones de Edad Activas:** Bloqueo automático de compra para menores de 18 años en películas `+18`, y advertencia obligatoria de acompañamiento de adulto responsable en películas `+13`.

---

## 4. Gestión de Entradas, QRs y Cancelaciones
* **Generación de Ticket Digital:** Emisión automática de comprobante con código QR único generado mediante Supabase.
* **Control de Accesos (Empleados):** Interfaz para escaneo de QRs o ingreso manual de códigos por parte del personal. Una vez validada la entrada o entregado el candy bar, **el QR se invalida automáticamente** en la base de datos para evitar reusos.
* **Cancelaciones y Crédito a Favor:** Los usuarios pueden cancelar sus entradas hasta **2 horas antes** de la función. No se realizan devoluciones en efectivo; el monto total se reintegra como **crédito a favor** en la cuenta del usuario para futuras compras.
* **Historial "Mis Películas":** Sección visual donde el usuario revisa su historial de funciones vistas, pósters, fechas y emite sus propias calificaciones.

---

## 5. Panel de Administración y Auditoría
* **Programación Automática de Funciones:** Algoritmo de asignación automática de salas que cruza horarios y garantiza un **buffer obligatorio de 30 minutos** para limpieza entre función y función, evitando superposiciones.
* **Reportes y Métricas:**
  * Facturación diaria y cantidad de entradas vendidas.
  * Gráficos estadísticos de películas más vistas por semana/mes y producto de candy más vendido.
  * Exportación de reportes de facturación a formatos **PDF** y **Excel**.
* **Configuración Dinámica:** Panel para modificar en tiempo real los porcentajes de cupones y los costos en puntos del programa de fidelización.
* **Log de Actividad:** Auditoría en tiempo real que registra cada acción administrativa o validación de empleados (fecha, hora, usuario y detalle).

---

## 6. Programa de Fidelización
* **Acumulación de Puntos:** Cada peso gastado otorga **1 punto** al usuario registrado.
* **Canje de Recompensas:** Los puntos acumulados pueden canjearse por entradas gratis o productos del candy bar, cuyos costos en puntos son configurables desde el panel de administración.
* **Historial de Canjes:** Visible en el perfil del usuario junto con sus puntos totales y crédito a favor.