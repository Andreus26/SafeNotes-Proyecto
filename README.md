# Safe Notes - Proyecto Full-Stack

Aplicación de gestión de notas con frontend en **React + Vite** conectado a una API REST en **Spring Boot** (`/api/notas`).

Estructura del repositorio:

* **`safenotes-frontend/`**: Interfaz web desarrollada en React + Vite con componentes modulares (`App`, `ListaNotas`, `TarjetaNota`) y consumo de la API REST mediante `fetch`, `useState` y `useEffect`.
* **`safenotes-api extraido/`**: Backend en Spring Boot que expone los endpoints en `/api/notas` con manejo de CORS y operaciones CRUD.
* **`evidencia-interfaz-inicial/`**: Evidencia de la interfaz estática inicial (HTML, CSS y JavaScript con almacenamiento local en el navegador), separada para mantener el historial sin mezclarla con la versión actual.
* **`script_safe_notes.sql` y `DIAGRAMA NOTAS DE SEGURIDAD FINALES.PNG`**: Script SQL y diagrama del modelo/seguridad del proyecto.

Avances implementados:

* Conexión del frontend en React con la API REST de Spring Boot (`/api/notas`) vía HTTP y configuración CORS.
* Creación de notas mediante formulario controlado (`texto`, `categoria`, `importante` con `POST`).
* Consulta de notas, búsqueda en tiempo real y filtro por categoría o notas importantes (`GET`).
* Edición de notas existentes desde la interfaz (`PUT`).
* Eliminación de registros (`DELETE`).
* Interfaz de dos columnas en tema oscuro.

Próximos pasos:

* Completar la persistencia en base de datos relacional (MySQL / JPA) y grabar el video demostrativo del funcionamiento integrado.
