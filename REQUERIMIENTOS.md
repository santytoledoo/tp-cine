# UTN Cinemas - Documento de Requerimientos y Alcance del Sistema
**Trabajo Práctico N° 1 - Programación IV**

Este documento detalla formalmente los requerimientos funcionales, técnicos y de negocio especificados por la directiva de inversores para el desarrollo integral de la plataforma de gestión y reservas de UTN Cinemas. Su propósito es servir como contrato de alcance técnico del software.

---

## 1. Módulo de Cartelera y Catálogo de Películas
* **Información Detallada:** Cada película registrada en el sistema contiene título, sinopsis, duración en minutos, imagen/póster oficial, restricciones etarias (`ATP`, `+13`, `+18`), formato de proyección (`2D`, `3D`, `4D`, `5D`) e idioma (`castellano` o `subtitulada`).
* **Página Principal (Home):** Visualización prioritaria en el Home del **Top 3 de películas más vendidas** en base a las métricas del sistema.
* **Buscador y Filtros Avanzados:** Buscador interactivo por texto (filtrando simultáneamente por nombre o sinopsis) y un selector dinámico de filtrado por **múltiples géneros** (`Acción`, `Comedia`, `Ciencia Ficción`, `Animación`, `Familiar`, `Thriller`, etc.).
* **Sistema de Reseñas y Calificaciones:** Los usuarios registrados pueden calificar las películas con estrellas (de 1 a 5) y redactar un comentario corto. El sistema calcula y muestra de forma automática la **puntuación promedio** de cada film antes de que el cliente decida avanzar con la compra.
* **Próximamente y Preventas:** 
  * Sección dedicada a estrenos futuros con opción de activar alertas por notificaciones.
  * Sistema de **preventa habilitada exactamente 7 días antes** del estreno con un precio promocional diferencial configurable por película. Pasada la fecha, el valor retorna al precio base general.

---

## 2. Configuración Física de las Salas y Mapa de Butacas
* **Distribución Estándar:** Cada sala física posee una estructura estricta de **20 filas** (numeradas alfabéticamente de la **A a la T**) divididas en **3 columnas** con bloques exactos de **4, 20 y 4 butacas** respectivamente, separadas por pasillos centrales de circulación.
* **Modificación por Discapacidad (Filas J y K):** Las dos filas centrales del complejo (**J y K**) fueron adaptadas para personas con movilidad reducida, reconfigurando sus bloques a una distribución de **2, 10 y 2 butacas** y resaltándose visualmente con un tono azul diferenciado en el mapa interactivo.
* **Butacas VIP (Filas R, S y T):** Las últimas 3 filas del complejo (**R, S y T**) están catalogadas como asientos VIP, con un valor superior ($8.000) y una advertencia visual explícita que el usuario debe aceptar antes de confirmar su selección.
* **Sincronización en Tiempo Real:** El mapa de butacas bloquea de forma interactiva e inmediata los asientos que ya fueron adquiridos por otros usuarios de manera simultánea en la base de datos.

---

## 3. Proceso de Compra Unificada, Candy Bar y Políticas de Usuario
* **Compra Integrada (Entradas + Confitería):** Los clientes pueden adquirir sus entradas y sumar productos o combos del **Candy Bar** (pochoclos, gaseosas, nachos y combos destacados) en una misma transacción, emitiéndose un **único código QR** válido tanto para el ingreso a la sala como para el retiro de los productos en confitería.
* **Registro de Usuarios y Datos Obligatorios:** Admite compras anónimas o mediante un registro de usuario validado que recopila: correo electrónico, contraseña, nombre, apellido, fecha de nacimiento, tipo de sangre, color de ojos y cantidad de días de vacaciones anuales.
* **Sistema de Cupones Configurable:**
  * **Cupón de Bienvenida / Primera Compra:** Otorga un porcentaje de descuento configurable en tiempo real desde el panel de administración (por defecto fijado en un **20% OFF**).
  * **Cupón Exclusivo para Mayores de 50 años:** Código (`MAYORES50`) que aplica de forma automática un **30% OFF** validando estrictamente que la edad del usuario sea igual o mayor a 50 años mediante su fecha de nacimiento.
* **Restricciones Etarias Activas:** 
  * Bloqueo estricto e impedimento de compra para menores de 18 años en películas calificadas como `+18`.
  * Advertencia obligatoria de acompañamiento de adulto responsable para menores de 13 años en películas `+13`.

---

## 4. Gestión de Entradas, QRs, Cancelaciones y Historial
* **Generación de Ticket Digital:** Emisión de un comprobante visual con código QR único (`UTN-CINE-XXXXXXXX`) generado mediante Supabase y respaldo local.
* **Control de Accesos (Personal de Empleados):** Módulo operativo para escaneo de QRs o ingreso manual de códigos alternativos. Una vez validada la entrada o entregado el pedido de candy bar, **el QR cambia su estado a "utilizada" e se invalida automáticamente** en la base de datos para prevenir reusos fraudulentos.
* **Política de Cancelaciones y Crédito a Favor:** Los usuarios tienen permitido cancelar sus funciones hasta **2 horas antes** del horario de inicio. No se realizan reintegros de dinero en efectivo; el monto total abonado se acredita de forma automática como **saldo a favor** en la billetera virtual del perfil para ser utilizado en futuras compras.
* **Historial de Usuario ("Mis Películas"):** Sección visual interactiva donde cada espectador consulta el listado cronológico de funciones vistas, pósters, fechas, butacas, montos y emite sus calificaciones personales.

---

## 5. Panel de Administración, Automatización y Auditoría
* **Programación Automática de Funciones:** Algoritmo de asignación inteligente de salas que cruza horarios de inicio, duración y un **buffer obligatorio de 30 minutos** destinados a tareas de limpieza, garantizando que jamás dos proyecciones coincidan en la misma sala simultáneamente.
* **Reportes de Gestión y Métricas:**
  * Visualización de la facturación diaria acumulada y cantidad total de entradas vendidas.
  * Tarjetas de rendimiento del producto de Candy Bar más vendido y gráficos estadísticos de visualizaciones de películas por semana/mes.
  * Funcionalidad de **exportación de reportes financieros a formatos PDF y Excel** mediante librerías nativas del cliente.
* **Configuración Dinámica en Tiempo Real:** Interfaz administrativa para modificar al instante los porcentajes de descuento de cupones y los costos en puntos del sistema de fidelización.
* **Log de Actividad y Auditoría:** Registro persistente de eventos que almacena fecha, hora, usuario responsable y detalle de cada acción crítica (creación de funciones, modificaciones de precios o validaciones de QRs por empleados).

---

## 6. Programa de Fidelización por Puntos
* **Regla de Acumulación:** Cada peso argentino gastado en compras dentro de la plataforma otorga al usuario registrado exactamente **1 punto** (`1 ARS = 1 Punto`).
* **Canje de Recompensas:** Los puntos acumulados no son transferibles entre cuentas y pueden canjearse directamente por beneficios estipulados (por ejemplo, **500 puntos** por una Entrada Gratis o **150 puntos** por un Pochoclo Grande / Combo Candy), cuyos costos operativos son configurables por el administrador.
* **Historial de Canjes:** Registro detallado visible en el perfil del usuario que refleja los puntos consumidos y las recompensas obtenidas.