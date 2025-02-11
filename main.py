from fastapi import FastAPI, HTTPException, Request, Depends, Query, Cookie
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi import FastAPI, HTTPException, Request, Depends, Query, Cookie, BackgroundTasks
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
import asyncio  # Añadir esta línea

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Montar la carpeta "static" para servir archivos como JavaScript, CSS, imágenes, etc.
app.mount("/static", StaticFiles(directory="static"), name="static")

# Configuración de Jinja2 para servir HTML
templates = Jinja2Templates(directory="templates")

db = database.API_Mensajeria()

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # Cambiar a 24 horas (1440 minutos)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: datetime.timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
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
class NewGroupRequest(BaseModel):
    groupName: str
    users: list

# @app.get("/", response_class=JSONResponse)
# def show_login_page(request: Request):
#     return templates.TemplateResponse("login.html", {"request": request})

@app.get("/", response_class=JSONResponse)
def show_login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})



# Función para verificar el usuario en la base de datos y validar la contraseña
def authenticate_user(username: str, password: str, request: Request):
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
        
@app.post("/login")
async def login(request: LoginRequest):
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
    print(f"UserId: {logged_in_user_id}") # Sale 14
    users = db.carregaUsuaris()
    groups = db.carregaGrups(logged_in_user_id)
    print(f"Grupos: {groups}") # Muestra todos los grupos, junto su nombre e id.

    # Convert datetime objects to strings
    for group in groups:
        for key, value in group.items():
            if isinstance(value, datetime.datetime):
                group[key] = value.isoformat()
    db.desconecta()
    return templates.TemplateResponse("users.html", {"request": request, "users": users, "groups": groups})


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
def get_conversation(username: str, request: Request, current_user: str = Depends(get_current_user), since: str = None):
    db.conecta()
    logged_in_user = current_user
    logged_in_user_id = db.get_user_id(logged_in_user)
    selected_user_id = db.get_user_id(username)

    if not logged_in_user_id or not selected_user_id:
        db.desconecta()
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    conversation = db.cargar_conversacion(logged_in_user_id, selected_user_id)
    print(f"Id del usuario loggeado: {logged_in_user}. Id del usuario seleccionado: {selected_user_id}")
    
    # Actualizar el estado de los mensajes a "rebut" si el receptor es el usuario logueado
    # for message in conversation:
    #     if message['receiver_id'] == logged_in_user_id and message['status'] == 'enviat':
    #         db.actualizar_estado_mensaje(message['id'], 'rebut')
    #         message['status'] = 'rebut'
    for message in conversation:
        if message['receiver_id'] == logged_in_user_id and message['status'] == 'enviat':
            db.actualizar_estado_mensaje('rebut', message['id'])
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
    groups = db.carregaGrups(logged_in_user_id)

    if not logged_in_user_id or not selected_user_id:
        db.desconecta()
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    print(f"Id del usuario loggeado: {logged_in_user_id}. Id del usuario seleccionado: {selected_user_id}") # Da mi id y el del otro usuario.
    conversation = db.cargar_conversacion(logged_in_user_id, selected_user_id)

    # Add usernames to the conversation data
    for message in conversation:
        message['sender_username'] = db.get_username(message['sender_id'])
        message['receiver_username'] = db.get_username(message['receiver_id'])
        message['created_at'] = message['created_at'].isoformat()

    users = db.carregaUsuaris()  # Cargar la lista de usuarios
    # print(users) # Hace un print con toda la info de los usuarios.
    user_profile_picture_url = db.get_user_profile_picture_url(logged_in_user_id)  # Obtener la URL de la foto de perfil
    selected_user_profile_picture_url = db.get_user_profile_picture_url(selected_user_id)  # Obtener la URL de la foto de perfil del usuario seleccionado
    user_bg_picture_url = db.get_user_bg_picture_url(logged_in_user_id)  # Obtener la URL de la imagen de fondo

    conversations = {}
    for user in users:
        user_id = db.get_user_id(user['username'])
        if user_id:
            conv = db.cargar_conversacion(logged_in_user_id, user_id)
            for msg in conv:
                msg['created_at'] = msg['created_at'].isoformat()
            conversations[user['username']] = conv

    db.desconecta()

    # for message in conversation:
    #     message['created_at'] = message['created_at'].isoformat()
    #     if message['receiver_id'] == logged_in_user_id:
    #         message['status'] = 'llegit'
    #     else:
    #         message['status'] = 'enviat'
    print(groups)
    return templates.TemplateResponse("chat.html", {
        "request": request,
        "conversation": conversation,
        "username": username,
        "users": users,
        "groups": groups,
        "user_profile_picture_url": user_profile_picture_url,  # Asegúrate de pasar esta variable a la plantilla
        "selected_user_profile_picture_url": selected_user_profile_picture_url,
        "user_bg_picture_url": user_bg_picture_url,
        "conversations": conversations
    })

@app.get("/chat", response_class=JSONResponse)
def chat_page(request: Request, current_user: str = Depends(get_current_user)):
    db.conecta()
    logged_in_user = current_user
    logged_in_user_id = db.get_user_id(logged_in_user)

    if not logged_in_user_id:
        db.desconecta()
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    users = db.carregaUsuaris()  # Cargar la lista de usuarios
    user_profile_picture_url = db.get_user_profile_picture_url(logged_in_user_id)  # Obtener la URL de la foto de perfil
    user_bg_picture_url = db.get_user_bg_picture_url(logged_in_user_id)  # Obtener la URL de la imagen de fondo

    conversations = {}
    for user in users:
        user_id = db.get_user_id(user['username'])
        if user_id:
            conv = db.cargar_conversacion(logged_in_user_id, user_id)
            for msg in conv:
                msg['created_at'] = msg['created_at'].isoformat()
            conversations[user['username']] = conv

    db.desconecta()

    return templates.TemplateResponse("chat.html", {
        "request": request,
        "username": logged_in_user,
        "users": users,
        "user_profile_picture_url": user_profile_picture_url,
        "user_bg_picture_url": user_bg_picture_url,
        "conversations": conversations
    })

@app.get("/chatsGrupos/{groupId}", response_class=JSONResponse)
def chat_group(groupId: str, request: Request, current_user: str = Depends(get_current_user)):
    db.conecta()
    loggedInUser = current_user
    loggedInUserId = db.get_user_id(loggedInUser)
    selectedGroup = db.getGroup(groupId)
    esAdmin = db.isAdmin(loggedInUserId, groupId)
    print(esAdmin)

    if not loggedInUser or not selectedGroup:
        db.desconecta()
        raise HTTPException(status_code=404, detail="Grupo no encontrado")
    
    conversation = db.cargarConversacionGrupo(selectedGroup['id'])
    members = db.get_group_members(groupId)
    user_bg_picture_url = db.get_user_bg_picture_url(loggedInUserId)  # Obtener la URL de la imagen de fondo
    
    for message in conversation:
        message['created_at'] = message['created_at'].isoformat()

    db.desconecta()

    return templates.TemplateResponse("chatGrupo.html", {"request": request, "conversation": conversation, "groupName": selectedGroup['name'], "members": members, "esadmin": esAdmin, "user_bg_picture_url": user_bg_picture_url})

@app.get("/manageMembers/{group_id}", response_class=HTMLResponse)
async def manage_members(request: Request, group_id: int, current_user: str = Depends(get_current_user)):
    db.conecta()
    group = db.getGroup(group_id)
    loggedInUser = current_user
    loggedInUserId = db.get_user_id(loggedInUser)
    selectedGroup = db.getGroup(group_id)
    members = db.getGroupMembersExceptYou(group_id, loggedInUserId)
    all_users = db.carregaUsuaris()  # Fetch all users

    # Add is_admin attribute to each member
    for member in members:
        member['is_admin'] = db.isAdmin(member['id'], group_id)

    db.desconecta()
    
    if not group:
        raise HTTPException(status_code=404, detail="Grupo no encontrado")
    
    return templates.TemplateResponse("manageMembers.html", {"request": request, "group": group, "members": members, "all_users": all_users})

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

    return JSONResponse(content={"message": "Foto de perfil actualizada", "new_profile_picture_url": data.profile_picture_url}, status_code=200)

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

# @app.delete("/leaveGroup/{current_user}/{groupId}")
# @app.delete("/leaveGroup/{current_user}/{groupId}")
# def leaveGroup(groupId, request: Request, current_user: str = Depends(get_current_user)):
#     db.conecta()
#     logged_in_user = current_user
#     logged_in_user_id = db.get_user_id(logged_in_user)
#     selectedGroup = db.getGroup(groupId)
#     print(logged_in_user_id)
#     print(selectedGroup)
#     db.leaveGroup(logged_in_user_id, selectedGroup)
#     db.desconecta()
#     return templates.TemplateResponse("users.html", {"request": request, "users": usersList})

@app.post("/leaveGroup", response_class=JSONResponse)
async def leave_group(request: Request, current_user: str = Depends(get_current_user)):
    data = await request.json()
    db.conecta()
    try:
        user_id = db.get_user_id(current_user)
        group_id = data.get('group_id')

        if not user_id or not group_id:
            raise HTTPException(status_code=400, detail="Missing user_id or group_id")

        db.leaveGroup(user_id, group_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.desconecta()

    return JSONResponse(content={"success": True}, status_code=200)

@app.post("/manage_member_action")
async def manage_member_action(request: Request):
    db.conecta()
    data = await request.json()
    user_id = data.get('userId')
    username = data.get('username')
    action = data.get('action')
    group_id = data.get('group_id')
    
    print(f"Received action: {action} for User ID: {user_id}, Username: {username}, Group ID: {group_id}") # Log the values
    
    if not user_id:
        user_id = db.get_user_id(username)
        print(f"Retrieved User ID: {user_id} for Username: {username}") # Log the retrieved user ID
    
    if not user_id or not group_id:
        db.desconecta()
        return JSONResponse({'status': 'fail', 'message': 'Missing user_id or group_id'}, status_code=400)
    
    # Perform the action (e.g., remove member, make admin)
    if action == 'remove':
        db.leaveGroup(user_id, group_id)
        db.desconecta()
        return JSONResponse({'status': 'success', 'message': 'Member removed'})
    elif action == 'makeAdmin':
        db.convertToAdmin(user_id, group_id)
        db.desconecta()
        return JSONResponse({'status': 'success', 'message': 'Member promoted to admin'})
    
    db.desconecta()
    return JSONResponse({'status': 'fail', 'message': 'Invalid action'}, status_code=400)

@app.post("/add_user_to_group")
async def add_user_to_group(request: Request):
    db.conecta()
    data = await request.json()
    user_id = data.get('userId')
    group_id = data.get('group_id')
    
    if not user_id or not group_id:
        db.desconecta()
        return JSONResponse({'status': 'fail', 'message': 'Missing user_id or group_id'}, status_code=400)
    
    try:
        db.addUsersToGroup(user_id, group_id, 0)  # 0 indicates the user is not an admin
        db.desconecta()
        return JSONResponse({'status': 'success', 'message': 'User added to group'})
    except Exception as e:
        db.desconecta()
        return JSONResponse({'status': 'fail', 'message': str(e)}, status_code=500)

# Lista para almacenar las conexiones WebSocket activas y los IDs de mensajes enviados
active_connections = []

@app.websocket("/ws/chat/{username}")
async def websocket_chat(websocket: WebSocket, username: str):
    global active_connections  # Declarar la variable como global
    await websocket.accept()
    active_connections.append({"websocket": websocket, "username": username, "sent_message_ids": set()})

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
                    if connection["username"] == username or connection["username"] == sender_username:
                        await connection["websocket"].send_json(message)
                        connection["sent_message_ids"].add(message_id)

            db.desconecta()
    except WebSocketDisconnect:
        active_connections = [conn for conn in active_connections if conn["websocket"] != websocket]

@app.post("/logout")
async def logout(request: Request):
    response = JSONResponse(content={"message": "Logout exitoso"}, status_code=200)
    response.delete_cookie("access_token")
    return response

if __name__ == '__main__':
    app.run(debug=True)
@app.post("/listen-for-new-messages")
async def listen_for_new_messages(websocket: WebSocket, background_tasks: BackgroundTasks, current_user: str = Depends(get_current_user)):
    await websocket.accept()
    db.conecta()
    logged_in_user_id = db.get_user_id(current_user)
    last_message_id = db.get_last_message_id()
    db.desconecta()

    async def check_for_new_messages():
        while True:
            db.conecta()
            new_last_message_id = db.get_last_message_id()
            if new_last_message_id != last_message_id:
                # Obtener el nuevo mensaje
                new_message = db.get_message_by_id(new_last_message_id)
                if new_message and new_message['receiver_id'] == logged_in_user_id:
                    # Enviar notificación al usuario
                    await websocket.send_json(new_message)
                last_message_id = new_last_message_id
            db.desconecta()
            await asyncio.sleep(5)  # Esperar 5 segundos antes de verificar nuevamente

    background_tasks.add_task(check_for_new_messages)
    return JSONResponse(content={"message": "Listening for new messages"}, status_code=200)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)  # Añadir reload=True para recargar automáticamente


