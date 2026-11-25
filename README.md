EOF
# Sistema de Control de Producción y Lotes

Prototipo full-stack orientado a entornos de manufactura e industria de procesos (gestión de líneas de producción, registro de lotes, automatización de carga y monitoreo web).

## Stack Tecnológico

- **Sistema operativo:** Linux (Debian / Ubuntu)
- **Base de datos:** PostgreSQL (`lineas_produccion`, `lotes`)
- **Backend / API:** Node.js + Express (`db.js`, `index.js`)
- **Automatización:** Python 3 + `requests` (`automatizar_lotes.py`)
- **Frontend:** HTML5, Bootstrap 5 y JavaScript (`public/index.html`)

## Arquitectura General

1. **PostgreSQL** almacena las líneas de producción y los lotes registrados.
2. **Express** expone endpoints REST (`/api/lineas`, `/api/lotes`) con consultas parametrizadas y manejo de errores.
3. **Python** (`automatizar_lotes.py`) simula el envío automatizado de lotes hacia la API.
4. **Interfaz web** (`public/index.html`) consume la API mediante `fetch` para visualizar y registrar lotes.

## Puesta en Marcha Local

### 1. Clonar y entrar al proyecto
```bash
git clone [https://github.com/faabianne/control-produccion-api.git](https://github.com/faabianne/control-produccion-api.git)
cd control-produccion-api