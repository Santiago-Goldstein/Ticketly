// Clase para manejar el carrito
class Cart {
    constructor() {
        this.items = {};
        this.total = 0;
        this.init();
    }

    init() {
        if (!document.querySelector('.cart-count')) {
            const cartBtn = document.querySelector('.cart-btn');
            if (cartBtn) {
                const cartCount = document.createElement('span');
                cartCount.className = 'cart-count';
                cartCount.textContent = '0';
                cartBtn.appendChild(cartCount);
            }
        }
    }

    addTickets(eventId, eventName, price, quantity, maxTickets = 6) {
        if (!this.items[eventId]) {
            this.items[eventId] = {
                name: eventName,
                price: price,
                quantity: 0
            };
        }

        const newQuantity = this.items[eventId].quantity + quantity;
        if (newQuantity > maxTickets) {
            throw new Error(`Máximo ${maxTickets} tickets por evento`);
        }

        this.items[eventId].quantity = newQuantity;
        this.calculateTotal();
        this.updateCartUI();
        this.saveToLocalStorage();
    }

    removeTickets(eventId, quantity) {
        if (this.items[eventId]) {
            this.items[eventId].quantity -= quantity;
            if (this.items[eventId].quantity <= 0) {
                delete this.items[eventId];
            }
            this.calculateTotal();
            this.updateCartUI();
            this.saveToLocalStorage();
        }
    }

    calculateTotal() {
        this.total = Object.values(this.items).reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
    }

    clearCart() {
        this.items = {};
        this.total = 0;
        this.updateCartUI();
        localStorage.removeItem('cart');
    }

    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = Object.values(this.items).reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify({
            items: this.items,
            total: this.total
        }));
    }

    loadFromLocalStorage() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const { items, total } = JSON.parse(savedCart);
            this.items = items;
            this.total = total;
            this.updateCartUI();
        }
    }
}

// Inicializar el carrito
const cart = new Cart();

// Función para mostrar el selector de tickets con SweetAlert2
async function showTicketSelector(event) {
    const result = await Swal.fire({
        title: event.name,
        html: `
            <div class="ticket-selector">
                <p>Precio: $${event.price}</p>
                <div class="quantity-selector">
                    <button class="swal2-confirm swal2-styled decrease-btn" type="button">-</button>
                    <input type="number" id="ticketQuantity" value="1" min="1" max="6" readonly>
                    <button class="swal2-confirm swal2-styled increase-btn" type="button">+</button>
                </div>
                <p class="subtitle">Máximo 6 tickets por compra</p>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Agregar al carrito',
        cancelButtonText: 'Cancelar',
        didOpen: () => {
            const input = document.getElementById('ticketQuantity');
            const decreaseBtn = document.querySelector('.decrease-btn');
            const increaseBtn = document.querySelector('.increase-btn');

            decreaseBtn.addEventListener('click', () => {
                const currentValue = parseInt(input.value);
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                }
            });

            increaseBtn.addEventListener('click', () => {
                const currentValue = parseInt(input.value);
                if (currentValue < 6) {
                    input.value = currentValue + 1;
                }
            });
        }
    });

    if (result.isConfirmed) {
        const quantity = parseInt(document.getElementById('ticketQuantity').value);
        try {
            cart.addTickets(event.id, event.name, event.price, quantity);
            Swal.fire({
                title: '¡Agregado al carrito!',
                text: `${quantity} tickets para ${event.name}`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    }
}

// Función para mostrar el carrito
function showCart() {
    if (Object.keys(cart.items).length === 0) {
        Swal.fire('Carrito vacío', 'No hay tickets en el carrito', 'info');
        return;
    }

    let cartHtml = '<div class="cart-items">';
    Object.entries(cart.items).forEach(([eventId, item]) => {
        cartHtml += `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>${item.quantity} tickets x $${item.price}</span>
                <button onclick="cart.removeTickets('${eventId}', 1)">-</button>
            </div>
        `;
    });
    cartHtml += `</div><div class="cart-total">Total: $${cart.total}</div>`;

    Swal.fire({
        title: 'Tu carrito',
        html: cartHtml,
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: 'Continuar compra',
        denyButtonText: 'Vaciar carrito',
        cancelButtonText: 'Cerrar'
    }).then((result) => {
        if (result.isConfirmed) {
            proceedToCheckout();
        } else if (result.isDenied) {
            cart.clearCart();
            Swal.fire('Carrito vaciado', '', 'info');
        }
    });
}

// Función para proceder al checkout
function proceedToCheckout() {
    // Verificar si el usuario está logueado
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
        Swal.fire({
            title: 'Procesando compra',
            html: 'Redirigiendo a la pasarela de pago...',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            }
        }).then(() => {
            cart.clearCart();  // Llamamos al método que vacía el carrito
            cart.updateCartUI();
            // Redirigir al checkout
            window.location.href = '/pages/checkout.html';
        });
    } else {
        Swal.fire({
            icon: 'info',
            title: 'Inicia sesión para proceder',
            confirmButtonText: 'Ir a login'
        }).then(() => {
            // Redirigir al login
            window.location.href = '/pages/login.html';
        });
    }
}


// Event listeners para los botones de compra
document.addEventListener('DOMContentLoaded', () => {
    // Función para encontrar todos los botones de tickets
    function findTicketButtons() {
        const buttons = Array.from(document.getElementsByTagName('button'));
        return buttons.filter(button => {
            return button.classList.contains('ticket-btn') || 
                   button.textContent.trim().toUpperCase() === 'TICKETS A LA VENTA';
        });
    }

    const ticketButtons = findTicketButtons();
    
    ticketButtons.forEach(button => {
        button.addEventListener('click', () => {
            const eventCard = button.closest('.event-card');
            if (!eventCard) return;

            const priceText = eventCard.querySelector('.price')?.textContent || '0';
            const price = parseInt(priceText.replace(/[^\d]/g, ''));
            const eventName = eventCard.querySelector('h3')?.textContent || 'Evento';

            const event = {
                id: eventCard.dataset.eventId || Math.random().toString(36).substr(2, 9),
                name: eventName,
                price: price
            };
            
            showTicketSelector(event);
        });
    });
});

// Cargar el carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    cart.loadFromLocalStorage();
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
            const cardCategory = card.getAttribute('data-category');
            
            if (filterValue === 'all') {
                card.style.display = 'flex';
            } else {
                if (cardCategory === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    });
});

// Buscador del hero
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('#eventFilter');
    const venueInput = document.querySelector('#locationFilter');
    const dateInput = document.querySelector('#dateFilter');
    const searchButton = document.querySelector('.search-button');

    function scrollToEvents() {
        const eventsSection = document.querySelector('.all-events');
        if (eventsSection) {
            eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function performSearch() {
        const searchTerm = searchInput?.value.toLowerCase() || '';
        const venueTerm = venueInput?.value.toLowerCase() || '';
        const dateTerm = dateInput?.value || '';

        let foundResults = false;

        eventCards.forEach(card => {
            const eventName = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const venue = card.querySelector('.venue')?.textContent.toLowerCase() || '';
            const date = card.querySelector('.date')?.textContent.toLowerCase() || '';

            const hasSearchTerm = searchTerm !== '';
            const hasVenueTerm = venueTerm !== '';
            const hasDateTerm = dateTerm !== '';

            const matchesSearch = !hasSearchTerm || eventName.includes(searchTerm);
            const matchesVenue = !hasVenueTerm || venue.includes(venueTerm);
            const matchesDate = !hasDateTerm || date.includes(dateTerm);

            if (matchesSearch && matchesVenue && matchesDate) {
                card.style.display = 'flex';
                foundResults = true;
            } else {
                card.style.display = 'none';
            }
        });

        return foundResults;
    }

    // Solo el botón de búsqueda activa la búsqueda y el scroll
    searchButton?.addEventListener('click', (e) => {
        e.preventDefault();
        const foundResults = performSearch();
        if (foundResults) {
            scrollToEvents();
        } else {
            Swal.fire({
                title: 'Sin resultados',
                text: 'No se encontraron eventos que coincidan con tu búsqueda',
                icon: 'info'
            });
        }
    });

    // Restaurar vista original cuando los campos estén vacíos
    [searchInput, venueInput, dateInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                if (!searchInput.value && !venueInput.value && !dateInput.value) {
                    eventCards.forEach(card => {
                        card.style.display = 'flex';
                    });
                }
            });
        }
    });
});

// Carrusel de eventos destacados
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.shows-carousel');
    const track = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.carousel-btn.prev');
    const nextButton = document.querySelector('.carousel-btn.next');

    if (!carousel || !track || !prevButton || !nextButton) return;

    let currentPosition = 0;
    const cardWidth = 400; // Ancho de cada card + gap
    const totalCards = track.children.length;
    const visibleCards = Math.floor(carousel.offsetWidth / cardWidth);
    const maxPosition = -(totalCards - visibleCards) * cardWidth;

    function updateCarouselPosition() {
        track.style.transform = `translateX(${currentPosition}px)`;
        
        // Actualizar estado de los botones
        prevButton.style.opacity = currentPosition === 0 ? '0.5' : '1';
        nextButton.style.opacity = currentPosition <= maxPosition ? '0.5' : '1';
    }

    prevButton.addEventListener('click', () => {
        if (currentPosition === 0) return;
        currentPosition = Math.min(currentPosition + cardWidth, 0);
        updateCarouselPosition();
    });

    nextButton.addEventListener('click', () => {
        if (currentPosition <= maxPosition) return;
        currentPosition = Math.max(currentPosition - cardWidth, maxPosition);
        updateCarouselPosition();
    });

    // Inicializar estado de los botones
    updateCarouselPosition();

    // Actualizar cuando cambie el tamaño de la ventana
    window.addEventListener('resize', () => {
        const newVisibleCards = Math.floor(carousel.offsetWidth / cardWidth);
        const newMaxPosition = -(totalCards - newVisibleCards) * cardWidth;
        
        if (currentPosition < newMaxPosition) {
            currentPosition = newMaxPosition;
            updateCarouselPosition();
        }
    });
});

// Menu box

document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggleMenu');
    const menuBox = document.getElementById('menubox');
  
    toggleButton.addEventListener('click', function() {
      menuBox.classList.toggle('active'); // Alterna la clase 'active' para mostrar/ocultar el menú
    });
  });
  
  
  