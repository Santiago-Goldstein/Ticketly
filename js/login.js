document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.querySelector('.login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            if (!username || !password) {
                Swal.fire({
                    icon: 'error',
                    title: 'Campos vacíos',
                    text: 'Por favor, completa todos los campos antes de iniciar sesión.'
                });
                return;
            }

            try {
                const loginData = { username, password };
                const response = await fetch('http://127.0.0.1:5000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(loginData)
                });

                const result = await response.json();
                if (response.ok) {

                    localStorage.setItem("isLoggedIn", "true");

                    Swal.fire({
                        icon: 'success',
                        title: 'Inicio de sesión exitoso',
                        text: `Bienvenido, ${username}!`
                    });

                    window.location.href = "menu_usuario.html";
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Credenciales incorrectas',
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
