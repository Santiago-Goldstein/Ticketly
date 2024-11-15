// Configuración
const CONFIG = {
    API_URL: '/api',
    IMAGES_PATH: '/assets/images',
    ANIMATION_DURATION: 300
};

// Utilidades
const utils = {
    formatPrice: (price) => `$${price.toFixed(2)}`,
    loadImage: (src) => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    })
};

// Manejadores de eventos
const eventHandlers = {
    addToCart: (event) => {
        // Lógica del carrito
    },
    search: (event) => {
        // Lógica de búsqueda
    }
};

document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const cards = document.querySelectorAll('.show-card');
    
    let currentPosition = 0;
    const cardWidth = cards[0].offsetWidth + 32; // ancho + gap
    const totalWidth = cardWidth * cards.length;
    
    function updateCarousel(direction) {
        if (direction === 'next') {
            currentPosition -= cardWidth;
            // Si llegamos al final, volvemos al inicio
            if (Math.abs(currentPosition) >= totalWidth) {
                currentPosition = 0;
            }
        } else {
            currentPosition += cardWidth;
            // Si estamos al inicio y vamos hacia atrás, vamos al final
            if (currentPosition > 0) {
                currentPosition = -(totalWidth - cardWidth);
            }
        }
        
        track.style.transform = `translateX(${currentPosition}px)`;
    }
    
    prevBtn.addEventListener('click', () => updateCarousel('prev'));
    nextBtn.addEventListener('click', () => updateCarousel('next'));
});

function filterEvents() {
    const location = document.getElementById('locationFilter').value.toLowerCase();
    const event = document.getElementById('eventFilter').value.toLowerCase();
    const date = document.getElementById('dateFilter').value;

    // Obtener todos los eventos
    const events = document.querySelectorAll('.event-card'); // Ajusta el selector según tu estructura

    events.forEach(event => {
        let matchLocation = true;
        let matchEvent = true;
        let matchDate = true;

        // Solo aplicar filtros si se ingresó un valor
        if (location) {
            matchLocation = event.dataset.location.toLowerCase().includes(location);
        }
        if (event) {
            matchEvent = event.dataset.eventType.toLowerCase().includes(event);
        }
        if (date) {
            matchDate = event.dataset.date === date;
        }

        // Mostrar el evento si cumple con todos los filtros aplicados
        if (matchLocation && matchEvent && matchDate) {
            event.style.display = 'block';
        } else {
            event.style.display = 'none';
        }
    });

    // Mostrar mensaje si no hay resultados
    const visibleEvents = document.querySelectorAll('.event-card[style="display: block"]');
    if (visibleEvents.length === 0) {
        Toastify({
            text: "No se encontraron eventos con esos filtros",
            duration: 3000,
            gravity: "top",
            position: "center",
            style: {
                background: "#e44d5a",
            }
        }).showToast();
    }
}

// Carrusel de shows
const track = document.querySelector('.carousel-track');
const cards = document.querySelectorAll('.show-card');
const cardWidth = cards[0].offsetWidth + 32; // Ancho + gap

document.querySelector('.carousel-btn.prev').addEventListener('click', () => {
    track.scrollBy({
        left: -cardWidth,
        behavior: 'smooth'
    });
});

document.querySelector('.carousel-btn.next').addEventListener('click', () => {
    track.scrollBy({
        left: cardWidth,
        behavior: 'smooth'
    });
});

// Filtros
const filterButtons = document.querySelectorAll('.filter-btn');
const eventCards = document.querySelectorAll('.event-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        eventCards.forEach(card => {
            if (filterValue === 'all') {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
                card.style.display = 'flex';
            } else {
                if (card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            }
        });
    });
});