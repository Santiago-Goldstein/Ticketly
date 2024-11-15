document.addEventListener("DOMContentLoaded", function() {
    const clubBtn = document.querySelector('.club-btn');

    clubBtn.addEventListener('click', function() {
        Swal.fire({
            icon: 'info',
            title: '¡Bienvenido al Club!',
            html: '<h3>¡Felicidades por unirte a nosotros!</h3><p>Estás a punto de obtener acceso exclusivo a preventas y paquetes VIP. ¡Disfruta de todas las ventajas!</p>',
            confirmButtonText: '¡Sí, quiero unirme ahora!',
            background: '#f2f2f2',
            customClass: {
                title: 'swal-title-custom',
                popup: 'swal-popup-custom',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const phoneNumber = '+541139556151';
                const message = '¡Hola! Quiero unirme al Club VIP para obtener acceso exclusivo a preventas y paquetes especiales. ¡Estoy listo para unirme!';

                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

                window.open(whatsappUrl, '_blank');
            }
        });
    });
});
