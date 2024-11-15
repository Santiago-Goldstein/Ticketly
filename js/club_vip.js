document.addEventListener("DOMContentLoaded", function() {
    const clubBtn = document.querySelector('.club-btn');

    clubBtn.addEventListener('click', function() {
        // Mostrar mensaje usando SweetAlert2
        Swal.fire({
            icon: 'info',
            title: '¡Bienvenido al Club!',
            html: '<h3>¡Felicidades por unirte a nosotros!</h3><p>Estás a punto de obtener acceso exclusivo a preventas y paquetes VIP. ¡Disfruta de todas las ventajas!</p>',
            confirmButtonText: '¡Sí, quiero unirme ahora!',
            background: '#f2f2f2',  // Fondo de la ventana emergente
            customClass: {
                title: 'swal-title-custom',
                popup: 'swal-popup-custom',
            },
        }).then((result) => {
            // Si el usuario acepta el mensaje
            if (result.isConfirmed) {
                // Redirigir a WhatsApp con el mensaje predeterminado
                const phoneNumber = '+541139556151'; // Reemplaza este número con el número de teléfono de WhatsApp de tu negocio
                const message = '¡Hola! Quiero unirme al Club VIP para obtener acceso exclusivo a preventas y paquetes especiales. ¡Estoy listo para unirme!';

                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

                // Redirigir al usuario a WhatsApp
                window.open(whatsappUrl, '_blank');
            }
        });
    });
});
