from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
# ...existing code...

@app.route('/update-profile-picture', methods=['POST'])
def update_profile_picture():
    data = request.get_json()
    profile_picture_url = data.get('profile_picture_url')

    if not profile_picture_url:
        return jsonify({"error": "No URL provided"}), 400

    user_id = request.cookies.get('session')

    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    api = API_Mensajeria()
    api.conecta()
    api.actualizar_foto_perfil(user_id, profile_picture_url)
    api.desconecta()

    return jsonify({"new_profile_picture_url": profile_picture_url})

# ...existing code...
