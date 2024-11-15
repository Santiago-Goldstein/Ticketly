document.addEventListener("click", function (event) {
    if (event.target.id === "logoutBtn" || event.target.id === "logoutBtn1") {
        Swal.fire({
            icon: 'info',
            title: '¿Estás seguro de que quieres cerrar sesión?',
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("isLoggedIn");
                Swal.fire({
                    icon: 'success',
                    title: 'Sesión cerrada',
                    text: 'Has cerrado sesión correctamente.',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    window.location.href = "index.html";
                });
            }
        });
    }
});




document.addEventListener("DOMContentLoaded", function() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
        window.location.href = "/pages/index.html";
    }
});
