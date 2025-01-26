docker build -t api_mensajeria . #construir la imagen
docker run -d -p 8000:8000 api_mensajeria # ejecutar la imagen en el puerto 