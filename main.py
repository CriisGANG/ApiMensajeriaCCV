from fastapi import FastAPI, HTTPException, Request, Depends, Query, Cookie
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordBearer
from werkzeug.security import generate_password_hash, check_password_hash
import database
import datetime
from fastapi import WebSocket, WebSocketDisconnect
from jose import JWTError, jwt
from passlib.context import CryptContext

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Montar la carpeta "static" para servir archivos como JavaScript, CSS, imágenes, etc.
app.mount("/static", StaticFiles(directory="static"), name="static")

# Configuración de Jinja2 para servir HTML
templates = Jinja2Templates(directory="templates")

db = database.API_Mensajeria()

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: datetime.timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if token is None:
        raise HTTPException(
            status_code=401,
            detail="No se proporcionó un token de autenticación",
            headers={"WWW-Authenticate": "Bearer"},
        )
    credentials_exception = HTTPException(
        status_code=401,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username

# Modelo para recibir datos del login
class LoginRequest(BaseModel):
    username: str
    password: str

# Modelo para recibir datos del mensaje
class MessageRequest(BaseModel):
    receiver_username: str
    content: str

class UpdateProfilePictureRequest(BaseModel):
    profile_picture_url: str

class UpdateBgPictureRequest(BaseModel):
    bg_picture_url: str

# @app.get("/", response_class=JSONResponse)
# def show_login_page(request: Request):
#     return templates.TemplateResponse("login.html", {"request": request})

@app.get("/")
async def serve_login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

# Función para verificar el usuario en la base de datos y validar la contraseña
def authenticate_user(username: str, password: str):
    db.conecta()
    user = db.verificar_usuario(request.username, request.password)
    db.desconecta()

    if user:
        access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": request.username}, expires_delta=access_token_expires
        )
        response = JSONResponse(content={"message": "Login exitoso", "username": request.username, "access_token": access_token}, status_code=200)
        response.set_cookie(key="access_token", value=access_token, httponly=True)
        return response
    else:
        raise HTTPException(
            status_code=401, detail="Usuario o contraseña incorrectos"
        )

@app.get("/users", response_class=JSONResponse)
def usersList(request: Request, current_user: str = Depends(get_current_user)):
    db.conecta()
    logged_in_user = current_user
    logged_in_user_id = db.get_user_id(logged_in_user)
    print(f"Username: {logged_in_user}") # Sale virginiajimenez
    print(f"Username: {logged_in_user_id}") # Sale 14
    users = db.carregaUsuaris()
    db.desconecta()
    return templates.TemplateResponse("users.html", {"request": request, "users": users})


@app.get("/groups")
async def groupList(request: Request):
    db.conecta()
    groups = db.carregaGrups()
    db.desconecta()

    # Convert datetime objects to strings
    for group in groups:
        for key, value in group.items():
            if isinstance(value, datetime.datetime):
                group[key] = value.isoformat()

    return templates.TemplateResponse("groups.html", {"request": request, "groups": groups})

@app.get("/conversation/{username}", response_class=JSONResponse)
def get_conversation(username: str, request: Request):
    db.conecta()
    logged_in_user = request.cookies.get("loggedInUser")
    if not logged_in_user:
        db.desconecta()
        raise HTTPException(status_code=401, detail="Usuario no autenticado")

    logged_in_user_id = db.get_user_id(logged_in_user)
    selected_user_id = db.get_user_id(username)

    if not logged_in_user_id or not selected_user_id:
        db.desconecta()
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    conversation = db.cargar_conversacion(logged_in_user_id, selected_user_id)
    
    # Actualizar el estado de los mensajes a "rebut" si el receptor es el usuario logueado
    for message in conversation:
        if message['receiver_id'] == logged_in_user_id and message['status'] == 'enviat':
            db.actualizar_estado_mensaje(message['id'], 'rebut')
            message['status'] = 'rebut'
    
    db.desconecta()

    for message in conversation:
        message['created_at'] = message['created_at'].isoformat()
        if message['receiver_id'] == logged_in_user_id:
            message['status'] = 'llegit'
        else:
            message['status'] = 'enviat'

    return JSONResponse(content=conversation, status_code=200)

@app.get("/chat/{username}", response_class=JSONResponse)
def chat_page(username: str, request: Request, current_user: str = Depends(get_current_user)):
    db.conecta()
    logged_in_user = current_user
    logged_in_user_id = db.get_user_id(logged_in_user)
    selected_user_id = db.get_user_id(username)

    if not logged_in_user_id or not selected_user_id:
        db.desconecta()
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    conversation = db.cargar_conversacion(logged_in_user_id, selected_user_id)

    # Add usernames to the conversation data
    for message in conversation:
        message['sender_username'] = db.get_username(message['sender_id'])
        message['receiver_username'] = db.get_username(message['receiver_id'])
        message['created_at'] = message['created_at'].isoformat()

    users = db.carregaUsuaris()  # Cargar la lista de usuarios
    user_profile_picture_url = db.get_user_profile_picture_url(logged_in_user_id)  # Obtener la URL de la foto de perfil
    selected_user_profile_picture_url = db.get_user_profile_picture_url(selected_user_id)  # Obtener la URL de la foto de perfil del usuario seleccionado
    user_bg_picture_url = db.get_user_bg_picture_url(logged_in_user_id)  # Obtener la URL de la imagen de fondo

    db.desconecta()

    return templates.TemplateResponse("chat.html", {
        "request": request,
        "conversation": conversation,
        "username": username,
        "users": users,
        "user_profile_picture_url": user_profile_picture_url,  # Asegúrate de pasar esta variable a la plantilla
        "selected_user_profile_picture_url": selected_user_profile_picture_url,
        "user_bg_picture_url": user_bg_picture_url
    })

@app.get("/chatsGrupos/{groupId}", response_class=JSONResponse)
def chat_group(groupId: str, request: Request, current_user: str = Depends(get_current_user)):
    db.conecta()
    loggedInUser = current_user
    loggedInUser = db.get_user_id(loggedInUser)
    selectedGroup = db.getGroup(groupId)

    if not loggedInUser or not selectedGroup:
        db.desconecta()
        raise HTTPException(status_code=404, detail="Grupo no encontrado")
    
    conversation = db.cargarConversacionGrupo(selectedGroup['id'])
    members = db.get_group_members(groupId)
    
    for message in conversation:
        message['created_at'] = message['created_at'].isoformat()

    db.desconecta()

    return templates.TemplateResponse("chatGrupo.html", {"request": request, "conversation": conversation, "groupName": selectedGroup['name'], "members": members})

@app.post("/send-message", response_class=JSONResponse)
async def send_message(request: Request, message: MessageRequest, current_user: str = Depends(get_current_user)):
    db.conecta()
    logged_in_user = current_user
    if not logged_in_user:
        db.desconecta()
        raise HTTPException(status_code=401, detail="Usuario no autenticado")

    sender_id = db.get_user_id(logged_in_user)
    receiver_id = db.get_user_id(message.receiver_username)

    if not sender_id or not receiver_id:
        db.desconecta()
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    db.insertar_mensaje(sender_id, receiver_id, message.content, 'enviat')
    db.desconecta()

    return JSONResponse(content={"message": "Mensaje enviado"}, status_code=200)

@app.post("/send-message-group", response_class=JSONResponse)
async def sendMessageGroup(request: Request, message: MessageRequest, current_user: str = Depends(get_current_user)):
    db.conecta()
    logged_in_user = current_user
    if not logged_in_user:
        db.desconecta()
        raise HTTPException(status_code=401, detail="Usuario no autenticado")

    sender_id = db.get_user_id(logged_in_user)
    group = db.getGroup(message.receiver_username)

    if not sender_id or not group:
        db.desconecta()
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    db.insertarMensajeGrupo(sender_id, group['id'], message.content)
    db.desconecta()

    return JSONResponse(content={"message": "Mensaje enviado"}, status_code=200)

@app.post("/update-profile-picture")
async def update_profile_picture(request: Request, data: UpdateProfilePictureRequest, current_user: str = Depends(get_current_user)):
    db.conecta()
    logged_in_user = current_user
    if not logged_in_user:
        db.desconecta()
        raise HTTPException(status_code=401, detail="Usuario no autenticado")

    user_id = db.get_user_id(logged_in_user)
    db.actualizar_foto_perfil(user_id, data.profile_picture_url)
    db.desconecta()

    return JSONResponse(content={"message": "Foto de perfil actualizada"}, status_code=200)

@app.post("/update-bg-picture")
async def update_bg_picture(request: Request, data: UpdateBgPictureRequest, current_user: str = Depends(get_current_user)):
    db.conecta()
    logged_in_user = current_user
    if not logged_in_user:
        db.desconecta()
        raise HTTPException(status_code=401, detail="Usuario no autenticado")

    user_id = db.get_user_id(logged_in_user)
    db.actualizar_imagen_fondo(user_id, data.bg_picture_url)
    db.desconecta()

    return JSONResponse(content={"message": "Imagen de fondo actualizada"}, status_code=200)

@app.get("/ultimas_conversaciones", response_class=JSONResponse)
async def ultimas_conversaciones():
    db.conecta()
    lista_usuarios = db.carregaUsuaris()
    print(lista_usuarios)
    db.desconecta()
    

@app.post("/newGroup", response_class=JSONResponse)
async def newGroup(request: Request, new_group: NewGroupRequest, current_user: str = Depends(get_current_user)):
    db.conecta()
    logged_in_user = current_user
    logged_in_user_id = db.get_user_id(logged_in_user)
    if not logged_in_user:
        db.desconecta()
        raise HTTPException(status_code=401, detail="Usuario no autenticado")

    try:
        # Crear el nuevo grupo
        group_id = db.newGroup(new_group.groupName, logged_in_user_id)
        db.addUsersToGroup(logged_in_user_id, group_id, 1)

        # Añadir los usuarios al grupo
        for username in new_group.users:
            user_id = db.get_user_id(username)
            if user_id:
                db.addUsersToGroup(user_id, group_id, 0)

        db.desconecta()
        return JSONResponse(content={"message": "Grupo creado exitosamente"}, status_code=200)
    except Exception as e:
        db.desconecta()
        print(f"Error creating group: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@app.get("/newGroup")
def newGroup(request: Request, current_user: str = Depends(get_current_user)):
    db.conecta()
    usersList = db.carregaUsuaris()
    logged_in_user = current_user
    logged_in_user_id = db.get_user_id(logged_in_user)
    print(logged_in_user_id) # Mostrará mi id (14).
    db.desconecta()
    
    return templates.TemplateResponse("newGroup.html", {"request": request, "users": usersList})

# Lista para almacenar las conexiones WebSocket activas y los IDs de mensajes enviados
active_connections = []

@app.websocket("/ws/chat/{username}")
async def websocket_chat(websocket: WebSocket, username: str):
    global active_connections  # Declarar la variable como global
    await websocket.accept()
    active_connections.append({"websocket": websocket, "sent_message_ids": set()})

    try:
        while True:
            data = await websocket.receive_json()  # Recibe mensaje del cliente
            sender_username = data["sender"]
            message_content = data["content"]
            message_id = data["id"]
            
            # Guardar mensaje en la base de datos
            db.conecta()
            sender_id = db.get_user_id(sender_username)
            receiver_id = db.get_user_id(username)

            if sender_id and receiver_id:
                db.insertar_mensaje(sender_id, receiver_id, message_content, 'enviat')

                # Construir el mensaje para enviar a todos los clientes conectados
                message = {
                    "id": message_id,
                    "sender_username": sender_username,
                    "content": message_content,
                    "status": "enviat",
                    "created_at": datetime.datetime.now().isoformat()
                }

                # Enviar mensaje a todos los clientes conectados
                for connection in active_connections:
                    if message_id not in connection["sent_message_ids"]:
                        await connection["websocket"].send_json(message)
                        connection["sent_message_ids"].add(message_id)

            db.desconecta()
    except WebSocketDisconnect:
        active_connections = [conn for conn in active_connections if conn["websocket"] != websocket]


