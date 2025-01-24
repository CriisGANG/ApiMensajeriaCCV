from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles


import database




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

@app.get("/", response_class=JSONResponse)
def show_login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/login")
async def login(request: LoginRequest):
    print(request)
    db = database.API_Mensajeria()
    db.conecta()
    user = db.verificar_usuario(request.username, request.password)
    db.desconecta()

    if user:
        return JSONResponse(content={"message": "Login exitoso", "username": request.username}, status_code=200)
    else:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

@app.get("/users")
def usersList():
    db.conecta()
    users = db.carregaUsuaris()
    db.desconecta()
    return users