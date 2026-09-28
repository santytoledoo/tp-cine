# UTN Cinemas - Sistema de Gestión y Reservas

Aplicación web integral para la gestión de un complejo de cines, permitiendo la reserva de entradas, compra en Candy Bar, validación de accesos y un panel administrativo completo.

## Arquitectura del Proyecto

El sistema está construido bajo una arquitectura Cliente-Servidor (BaaS) utilizando las siguientes tecnologías:

*   **Frontend:** Angular (Framework principal). Utiliza *Standalone Components* para una mejor modularización y carga perezosa (lazy loading) intrínseca.
*   **Backend & Base de Datos:** Supabase (Backend as a Service). Se encarga de la autenticación de usuarios y la gestión de la base de datos relacional (PostgreSQL).
*   **PWA (Progressive Web App):** Configurada con Angular Service Worker (`ngsw-config.json`) para permitir la instalación de la app y un manejo eficiente de la caché, mejorando los tiempos de carga.

## Decisiones Técnicas

1.  **Estructura de Directorios por Dominio:** Se dividió el código en áreas lógicas de negocio (`/admin`, `/cliente`, `/empleado`, `/auth`) en lugar de agrupar por tipo de archivo, facilitando la escalabilidad del proyecto.
2.  **Manejo de SSR (Server-Side Rendering):** Al utilizar Angular Universal/SSR, se implementaron validaciones con `isPlatformBrowser` y la inyección de `PLATFORM_ID` en componentes como el mapa de butacas y la generación del QR. Esto previene errores en el servidor de Node.js al intentar acceder a APIs exclusivas del navegador como `localStorage` o `window`.
3.  **Lógica de Asignación Automática:** Para evitar superposiciones, el algoritmo de programación de funciones cruza la hora de inicio y fin de cada película en una sala específica, añadiendo un *buffer* estricto de 30 minutos obligatorios para limpieza antes de autorizar la creación del registro.
4.  **Generación de Reportes en el Cliente:** Para liberar carga del servidor, la generación de PDFs (jsPDF) y archivos Excel (xlsx) se realiza directamente en el navegador del administrador mediante el procesamiento del DOM y arrays de datos locales.

## Instalación y Ejecución Local

1. Clonar el repositorio.
2. Ejecutar `npm install` para instalar las dependencias.
3. Ejecutar `ng serve` para iniciar el servidor de desarrollo local en `http://localhost:4200/`.