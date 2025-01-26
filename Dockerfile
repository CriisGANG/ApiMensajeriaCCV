# Usa una imagen base ligera con Python
FROM python:3.11-slim
#APUNTANDO A TU LOCAL
ENV DATABASE_URL="mysql+pymysql://root:@host.docker.internal:3306/whatsapp2425"
#APUNTANDO AL DEL PROFE
#ENV DATABASE_URL="mysql+pymysql://cristinalopez:43463157B@192.168.193.133:3306/cristinalopez"

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias e instala paquetes
COPY ./app/requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copia el código de la aplicación
COPY ./app /app

# Expone el puerto en el que correrá la aplicación (si es necesario)
EXPOSE 8000

CMD ["fastapi", "run"]