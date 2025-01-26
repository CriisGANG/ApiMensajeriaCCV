from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
import database
import datetime

app = FastAPI()

db = database.API_Mensajeria()

# Montar la carpeta "static" para servir archivos como JavaScript, CSS, imágenes, etc.
app.mount("/static", StaticFiles(directory="static"), name="static")

# Configuración de Jinja2 para servir HTML
templates = Jinja2Templates(directory="templates")

# Modelo para recibir datos del login
class LoginRequest(BaseModel):
    username: str
    password: str

# Modelo para recibir datos del mensaje
class MessageRequest(BaseModel):
    receiver_username: str
    content: str

@app.get("/", response_class=JSONResponse)
def show_login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/login")
async def login(request: LoginRequest):
    db.conecta()
    user = db.verificar_usuario(request.username, request.password)
    db.desconecta()

    if user:
        response = JSONResponse(
            content={"message": "Login exitoso", "username": request.username}, status_code=200)
        response.set_cookie(key="loggedInUser", value=request.username)
        return response
    else:
        raise HTTPException(
            status_code=401, detail="Usuario o contraseña incorrectos")

@app.get("/users", response_class=JSONResponse)
def usersList(request: Request):
    db.conecta()
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

    # Debugging statements
    print(f"Logged in user: {logged_in_user}, ID: {logged_in_user_id}")
    print(f"Selected user: {username}, ID: {selected_user_id}")

    if not logged_in_user_id or not selected_user_id:
        db.desconecta()
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    conversation = db.cargar_conversacion(logged_in_user_id, selected_user_id)
    db.desconecta()

    # Convert datetime objects to strings
    for message in conversation:
        message['created_at'] = message['created_at'].isoformat()

    # Debugging statement
    print(f"Conversation: {conversation}")

    if conversation:
        return JSONResponse(content=conversation, status_code=200)
    else:
        raise HTTPException(
            status_code=404, detail="Conversación no encontrada")

@app.get("/chat/{username}", response_class=JSONResponse)
def chat_page(username: str, request: Request):
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

    # Add usernames to the conversation data
    for message in conversation:
        message['sender_username'] = db.get_username(message['sender_id'])
        message['receiver_username'] = db.get_username(message['receiver_id'])
        message['created_at'] = message['created_at'].isoformat()

    db.desconecta()

    return templates.TemplateResponse("chat.html", {"request": request, "conversation": conversation, "username": username})

@app.get("/chatsGrupos/{groupId}", response_class=JSONResponse)
def chat_group(groupId: str, request: Request):
    db.conecta()
    loggedInUser = request.cookies.get("loggedInUser")
    if not loggedInUser:
        db.desconecta()
        raise HTTPException(status_code=401, detail="Usuario no autenticado")

    loggedInUser = db.get_user_id(loggedInUser)
    selectedGroup = db.getGroup(groupId)

    if not loggedInUser or not selectedGroup:
        db.desconecta()
        raise HTTPException(status_code=404, detail="Grupo no encontrado")
    
    conversation = db.cargarConversacionGrupo(selectedGroup['id'])
    
    for message in conversation:
        message['created_at'] = message['created_at'].isoformat()

    db.desconecta()

    return templates.TemplateResponse("chatGrupo.html", {"request": request, "conversation": conversation, "groupName": selectedGroup['name']})

@app.post("/send-message", response_class=JSONResponse)
async def send_message(request: Request, message: MessageRequest):
    db.conecta()
    logged_in_user = request.cookies.get("loggedInUser")
    if not logged_in_user:
        db.desconecta()
        raise HTTPException(status_code=401, detail="Usuario no autenticado")

    sender_id = db.get_user_id(logged_in_user)
    receiver_id = db.get_user_id(message.receiver_username)

    if not sender_id or not receiver_id:
        db.desconecta()
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    db.insertar_mensaje(sender_id, receiver_id, message.content)
    db.desconecta()

    return JSONResponse(content={"message": "Mensaje enviado"}, status_code=200)

@app.post("/send-message-group", response_class=JSONResponse)
async def sendMessageGroup(request: Request, message: MessageRequest):
    db.conecta()
    logged_in_user = request.cookies.get("loggedInUser")
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
