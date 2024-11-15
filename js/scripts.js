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
    Swal.fire({
        title: 'Procesando compra',
        html: 'Redirigiendo a la pasarela de pago...',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
        }
    }).then(() => {
        // Aquí irías a tu pasarela de pago
        window.location.href = '/checkout';
    });
}

// Event listeners para los botones de compra
document.querySelectorAll('.ticket-btn').forEach(button => {
    button.addEventListener('click', () => {
        const eventCard = button.closest('.event-card');
        const priceText = eventCard.querySelector('.price').textContent;
        const price = parseInt(priceText.replace(/[^\d]/g, '')); // Extrae solo los números

        const event = {
            id: eventCard.dataset.eventId || Math.random().toString(36).substr(2, 9),
            name: eventCard.querySelector('h3').textContent,
            price: price
        };
        
        showTicketSelector(event);
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