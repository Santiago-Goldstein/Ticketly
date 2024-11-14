// Asegúrate de que el código se ejecute cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function() {
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            // Mostrar un mensaje de confirmación para verificar que el evento está funcionando
            Swal.fire({
                icon: 'info',
                title: '¿Estás seguro de que quieres cerrar sesión?',
                showCancelButton: true,
                confirmButtonText: 'Sí, cerrar sesión',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Eliminar el estado de inicio de sesión en localStorage
                    localStorage.removeItem("isLoggedIn");

                    // Confirmar el cierre de sesión
                    Swal.fire({
                        icon: 'success',
                        title: 'Sesión cerrada',
                        text: 'Has cerrado sesión correctamente.',
                        confirmButtonText: 'Aceptar'
                    }).then(() => {
                        // Redirigir a la página de inico
                        window.location.href = "/pages/index.html";
                    });
                }
            });
        });
    } else {
        console.error("Botón de cerrar sesión no encontrado");
    }
});



document.addEventListener("DOMContentLoaded", function() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
        // Redirigir a la página de inicio
        window.location.href = "/pages/index.html";
    }
});
