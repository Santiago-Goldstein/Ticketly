// register.js

document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.querySelector('.register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Evita el envío del formulario

            // Obtener valores de los campos
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validación simple de campos vacíos
            if (!username || !password || !confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'Campos vacíos',
                    text: 'Por favor, completa todos los campos.'
                });
                return;
            }

            // Verificar que las contraseñas coincidan
            if (password !== confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'Contraseñas no coinciden',
                    text: 'Asegúrate de que las contraseñas sean iguales.'
                });
                return;
            }

            // Enviar datos al servidor para registrar al usuario
            try {
                const newUser = { username, password };
                const response = await fetch('http://127.0.0.1:5000/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser)
                });

                const result = await response.json();
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Registro exitoso',
                        text: `Bienvenido, ${username}!`
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al registrar',
                        text: result.message
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de conexión',
                    text: 'No se pudo conectar al servidor.'
                });
            }
        });
    }
});
