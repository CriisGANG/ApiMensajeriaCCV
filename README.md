# API Mensajería CCV

Este proyecto es una API desarrollada en FastAPI para gestionar un sistema de mensajería. A continuación, se describe la estructura del proyecto y sus componentes principales.

## Estructura del Proyecto

```md
ApiMensajeriaCCV
├── env/
├── static/
│   ├── css/
│   ├── img/
│   ├── js/
├── templates/
│   ├── configuracion.html
│   ├── index.html
├── .gitignore
├── app.py
├── database.py
├── main.py
├── README.md
├── requirements.txt
```

## Descripción de los Archivos y Directorios

- `env/` - Entorno virtual para gestionar las dependencias del proyecto.
- `static/` - Contiene archivos estáticos como hojas de estilo, imágenes y scripts JavaScript.
  - `css/` - Archivos de estilos CSS.
  - `img/` - Imágenes utilizadas en la aplicación.
  - `js/` - Archivos JavaScript.
  - `templates/` - Contiene archivos HTML y scripts relacionados con la interfaz de usuario.
  - `configuracion.html` - Plantilla para configuración perfil.
  - `index.html` - Página principal de la aplicación.
- `.gitignore` - Archivo para excluir ciertos archivos del repositorio Git.
- `app.py` - Archivo principal que inicia la aplicación.
- `database.py` - Configuración y conexión a la base de datos MySQL.
- `main.py` - Punto de entrada de la API.
- `README.md` - Documentación del proyecto.
- `requirements.txt` - Lista de dependencias necesarias para el proyecto.

## Instalación

1. Clonar el repositorio:
   ```sh
   git clone <repositorio>
   cd "ApiMensajeriaCCV cris"
   ```
2. Crear y activar un entorno virtual:
   ```sh
   python -m venv env
   source env/bin/activate  # En Windows: env\Scripts\activate
   ```
3. Instalar las dependencias:
   ```sh
   pip install -r requirements.txt
   ```
4. Configurar las variables de entorno en un archivo `.env`.

## Uso

Para ejecutar la API:
```sh
fastapi dev main.py
```

La documentación de la API estará disponible en:
- `http://127.0.0.1:8000/docs` (Swagger UI)

