document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.querySelector('.register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (!username || !password || !confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'Campos vacíos',
                    text: 'Por favor, completa todos los campos.'
                });
                return;
            }

            if (password !== confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'Contraseñas no coinciden',
                    text: 'Asegúrate de que las contraseñas sean iguales.'
                });
                return;
            }

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
