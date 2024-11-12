from flask import Flask, request, jsonify
from flask_cors import CORS  # Importamos CORS
import json
import os

app = Flask(__name__)

# Habilitar CORS para toda la aplicación
CORS(app)

# Ruta para registrar un nuevo usuario
@app.route('/register', methods=['POST'])
def register():
    # Recibir datos desde el frontend
    data = request.get_json()

    # Comprobar si el archivo JSON de usuarios existe, sino lo creamos
    users_file = 'users.json'
    if os.path.exists(users_file):
        with open(users_file, 'r') as file:
            users = json.load(file)
    else:
        users = []

    # Verificar que el usuario no exista ya
    for user in users:
        if user['username'] == data['username']:
            return jsonify({"message": "El usuario ya existe"}), 400

    # Agregar el nuevo usuario
    users.append(data)

    # Guardar los usuarios en el archivo JSON
    with open(users_file, 'w') as file:
        json.dump(users, file, indent=4)

    return jsonify({"message": "Usuario registrado exitosamente"}), 201

# Ruta para iniciar sesión
@app.route('/login', methods=['POST'])
def login():
    # Recibir los datos de inicio de sesión
    data = request.get_json()

    # Leer los usuarios del archivo JSON
    users_file = 'users.json'
    if not os.path.exists(users_file):
        return jsonify({"message": "No se encontraron usuarios registrados"}), 404

    with open(users_file, 'r') as file:
        users = json.load(file)

    # Verificar si el usuario existe y si la contraseña es correcta
    for user in users:
        if user['username'] == data['username'] and user['password'] == data['password']:
            return jsonify({"message": "Inicio de sesión exitoso"}), 200

    return jsonify({"message": "Usuario o contraseña incorrectos"}), 401

if __name__ == '__main__':
    app.run(debug=True)
