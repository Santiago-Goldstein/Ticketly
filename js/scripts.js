class Producto {
    constructor(id, nombre, tipo, variedad, precio, cantidad, img) {
            this.id = id,
            this.nombre = nombre,
            this.tipo = tipo,
            this.variedad = variedad,
            this.precio = precio,
            this.cantidad = cantidad,
            this.img = img
    }
}

//capturas DOM

let section2 = document.getElementById("section2")
let btnNuevoProducto = document.getElementById("nuevoProducto")
let btnOrdenarId = document.getElementById("ordenarId")
let btnOrdenarNombre = document.getElementById("ordenarNombre")
let btnOrdenarMenorPrecio = document.getElementById("ordenarMenorPrecio")
let btnOrdenarMayorPrecio = document.getElementById("ordenarMayorPrecio")
let inputBuscador = document.getElementById("buscador")
let btnCarrito = document.getElementById("btnCarrito")
let btnCarrito2 = document.getElementById("btnCarrito2")
let btnCarrito3 = document.getElementById("btnCarrito3")
let btnCarrito4 = document.getElementById("btnCarrito4")
let modalBodyCarrito = document.getElementById("modalBodyCarrito")
let divCompra = document.getElementById("divCompra")
let resultadoTexto = document.getElementById("resultadoTexto")
let loader = document.getElementById("loader")
let btnFinalizarCompra = document.getElementById("btnFinalizarCompra")
let resultadoTextoOrdenar = document.getElementById("resultadoTextoOrdenar")


//EVENTOS

btnOrdenarId.addEventListener('click', () => { ordenarId(eshop) })
btnOrdenarNombre.addEventListener('click', () => { ordenarNombre(eshop) })
btnOrdenarMenorPrecio.addEventListener('click', () => { ordenarMenorMayor(eshop) })
btnOrdenarMayorPrecio.addEventListener('click', () => { ordenarMayorMenor(eshop) })
inputBuscador.addEventListener('input', () => { buscador(inputBuscador.value, eshop) })
btnCarrito.addEventListener("click", () => { cargarProductosCarrito(productosEnCarrito) })
btnCarrito2.addEventListener("click", () => { cargarProductosCarrito(productosEnCarrito) })
btnCarrito3.addEventListener("click", () => { cargarProductosCarrito(productosEnCarrito) })
btnCarrito4.addEventListener("click", () => { cargarProductosCarrito(productosEnCarrito) })
btnFinalizarCompra.addEventListener("click", () => { finalizarCompra(productosEnCarrito) })


let eshop = []

//ASYNC
let pedirDatos = async () => {
    let resp = await fetch('./js/data.json')
    let data = await resp.json()  
    data.forEach((elem)=> {
        let producto = new Producto (elem.id, elem.nombre, elem.tipo, elem.variedad, elem.precio, elem.cantidad, elem.img)
        eshop.push(producto)
        console.log(producto)
    })
    localStorage.setItem("eshop", JSON.stringify(eshop))
}

//CONDICIONAL PRIMER INGRESO

if (localStorage.getItem("eshop")) {
    eshop = JSON.parse(localStorage.getItem("eshop"))
} else {
    pedirDatos()
}

//Display catalogo

function mostrarCatalogo(array) {
    section2.innerHTML = ""
    for (let elem of array) {
        let nuevoProducto = document.createElement("div")
        nuevoProducto.innerHTML = `<div id="${elem.id}" class="card" style="width: 18rem;">
            <img class="card-img-top img-fluid" style="height: 200px;"src="/multimedia/${elem.img}" alt="${elem.nombre} de ${elem.tipo}">
            <div class="card-body">
                <h4> Nº ${elem.id}</h4>
                <h4 class="card-title">${elem.nombre}</h4>
                <p> Tipo: ${elem.tipo}</p>
                <p> Variedad: ${elem.variedad}</p>
                <p class="">Precio: $${elem.precio}</p>
                <button id="agregarBtn${elem.id}" class="btn btn-outline-success">Agregar al carrito</button>
            </div>
        </div>`
        section2.appendChild(nuevoProducto)
        let btnAgregar = document.getElementById(`agregarBtn${elem.id}`)
        btnAgregar.addEventListener("click", () => {
            agregarAlCarrito(elem)
        })
    }
}

//Funciones Ordenar

function ordenarMenorMayor(array) {
    resultadoTextoOrdenar.innerHTML = `<h6 class="text-success m-2">Ordenado por Menor Precio `
    section2.innerHTML = "<div id='testing'></div>"
    section2.innerHTML = `<div class="d-flex align-items-center" id="loader">
    <div class="spinner-border text-success ms-auto" role="status" aria-hidden="true"></div></div>`
    array.sort((a, b) => (a.precio - b.precio))
    localStorage.setItem("eshop", JSON.stringify(array))
    setTimeout(() => {
        loader.innerHTML = ''
        mostrarCatalogo(array)
    }, 200)
}

function ordenarMayorMenor(array) {
    resultadoTextoOrdenar.innerHTML = `<h6 class="text-success m-2">Ordenado por Mayor Precio `
    section2.innerHTML = "<div id='testing'></div>"
    section2.innerHTML = `<div class="d-flex align-items-center" id="loader">
    <div class="spinner-border text-success ms-auto" role="status" aria-hidden="true"></div></div>`
    array.sort((a, b) => (b.precio - a.precio))
    localStorage.setItem("eshop", JSON.stringify(array))
    setTimeout(() => {
        loader.innerHTML = ''
        mostrarCatalogo(array)
    }, 200)
}

function ordenarId(array) {
    resultadoTextoOrdenar.innerHTML = `<h6 class="text-success m-2">Ordenado por Nº de ID `
    section2.innerHTML = "<div id='testing'></div>"
    section2.innerHTML = `<div class="d-flex align-items-center" id="loader">
    <div class="spinner-border text-success ms-auto" role="status" aria-hidden="true"></div></div>`
    array.sort((a, b) => (a.id - b.id))
    localStorage.setItem("eshop", JSON.stringify(array))
    setTimeout(() => {
        loader.innerHTML = ''
        mostrarCatalogo(array)
    }, 200)
}

function ordenarNombre(array) {
    resultadoTextoOrdenar.innerHTML = `<h6 class="text-success m-2">Ordenado alfabeticamente por Nombre `
    section2.innerHTML = "<div id='testing'></div>"
    section2.innerHTML = `<div class="d-flex align-items-center" id="loader">
    <div class="spinner-border text-success ms-auto" role="status" aria-hidden="true"></div></div>`
    array.sort((a, b) => {
        if (a.nombre < b.nombre) {
            return -1;
        }
        if (a.nombre > b.nombre) {
            return 1;
        }
        return 0;
    })
    localStorage.setItem("eshop", JSON.stringify(array))
    setTimeout(() => {
        loader.innerHTML = ''
        mostrarCatalogo(array)
    }, 200)
}

//Funcion Buscador 

function buscador(buscado, array) {
    resultadoTexto.innerHTML = ""
    let busqueda = array.filter(
        (elem) => elem.nombre.toLowerCase().includes(buscado.toLowerCase()) || elem.tipo.toLowerCase().includes(buscado.toLowerCase()) || elem.variedad.toLowerCase().includes(buscado.toLowerCase()) || [elem.precio].includes(parseInt(buscado)) || [elem.id].includes(parseInt(buscado)))
    busqueda.length == 0 ? (resultadoTexto.innerHTML = `<h6 class="text-success m-2">No hay coincidencias con su búsqueda... `)
        : (section2.innerHTML = "", mostrarCatalogo(busqueda))
}

//------Carrito

let productosEnCarrito = []

if (localStorage.getItem("carrito")) {
    productosEnCarrito = JSON.parse(localStorage.getItem("carrito"))
} else {
    console.log("Seteando el array carrito por primera vez")
    localStorage.setItem("carrito", JSON.stringify(productosEnCarrito))
}

//Agregar al carrito

function agregarAlCarrito(producto) {
    if (producto.cantidad == 0) {
        productosEnCarrito.push(producto)
        for (let elem of productosEnCarrito) {
            if (elem.id == producto.id) {
                elem.cantidad++;
            }
        }
        localStorage.setItem("carrito", JSON.stringify(productosEnCarrito))
        Toastify({
            text: `Agregado el producto ${producto.tipo} ${producto.nombre} al carrito.
        Cantidad en carrito: ${producto.cantidad}`,
            className: "info",
            duration: 1500,
            gravity: "top",
            position: "center",
            style: {
                background: "linear-gradient(to right, #754570, #C272BA)",
            }
        }).showToast();
    } else {
        for (let elem of productosEnCarrito) {
            if (elem.id == producto.id) {
                elem.cantidad++
                producto.cantidad = elem.cantidad
            }
        }
        localStorage.setItem("carrito", JSON.stringify(productosEnCarrito))
        Toastify({
            text: `Agregado el producto ${producto.tipo} ${producto.nombre} al carrito.
            Cantidad en carrito: ${producto.cantidad}`,
            className: "info",
            duration: 1500,
            gravity: "top",
            position: "center",
            style: {
                background: "linear-gradient(to right, #754570, #C272BA)",
            }
        }).showToast();
    }
    localStorage.setItem("eshop", JSON.stringify(eshop))
}

function cargarProductosCarrito(array) {
    modalBodyCarrito.innerHTML = ""
    array.forEach((producto) => {
        modalBodyCarrito.innerHTML += `
        <div class="card" id="productoCarrito${producto.id}" style="width: 80%; margin: auto; margin-bottom: 5%;">
        <img src="/multimedia/${producto.img}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <h6 class="card-id">Nº ${producto.id}</h6>
            <p class="card-text">${producto.tipo}</p>
            <p class="card-text">Precio: $${producto.precio}</p>
            <p class="card-text">Cantidad: ${producto.cantidad}</p>
            <button class= "btn btn-danger" id="botonEliminar${producto.id}">Eliminar</a>
        </div>
        </div>
        `
    })
    array.forEach((producto) => {
        document.getElementById(`botonEliminar${producto.id}`).addEventListener("click", () => {
            //Eliminar del DOM
            let cardProducto = document.getElementById(`productoCarrito${producto.id}`)
            cardProducto.remove()
            //Eliminar del array de comprar
            let ids = array.map(elem => elem.id)
            let indice = ids.indexOf(producto.id)
            if (indice != -1) { productosEnCarrito.splice(indice, 1) }
            localStorage.setItem('carrito', JSON.stringify(productosEnCarrito))
            //seteo el eshop en 0
            for (elemento of eshop) {
                if (elemento.id == producto.id) {
                    elemento.cantidad = 0;
                }
            }
            localStorage.setItem("eshop", JSON.stringify(eshop))
            //calculo compraTotal
            compraTotal(array)
        })
    })
    compraTotal(array)
}

//Compra total

function compraTotal(array) {
    let acumulador = 0
    acumulador = array.reduce((acc, productoCarrito) => acc + (productoCarrito.precio * productoCarrito.cantidad), 0)
    acumulador == 0 ? divCompra.innerHTML = `No hay productos en el carrito` : divCompra.innerHTML = `<p class="totalCompraTexto">EL total de su compra es $${acumulador}</p>`
}

// Finalizar Compra

function finalizarCompra() {
    if (productosEnCarrito.length === 0) {
        Swal.fire('No hay productos en el carrito');
    } else {
        Swal.fire({
            title: '¡Ya casi es tuyo!',
            html: `
                <form id="formularioCompra">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" class="swal2-input" required>
                    <label for="tarjeta">Número de Tarjeta:</label>
                    <input type="text" id="tarjeta" class="swal2-input" required>
                </form>`,
            confirmButtonText: 'Finalizar Compra',
            showDenyButton: true,
            denyButtonText: 'Volver',
            preConfirm: () => {
                const nombreUsuario = Swal.getPopup().querySelector('#nombre').value;
                const numeroTarjeta = Swal.getPopup().querySelector('#tarjeta').value;

                if (!nombreUsuario || !numeroTarjeta) {
                    Swal.showValidationMessage('Por favor, completa todos los campos.');
                }

                return { nombreUsuario, numeroTarjeta };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                limpiarCarritoYProductos();

                Swal.fire('Compra finalizada. ¡Gracias por comprar con nosotros!', '', 'success');
            } else if (result.isDenied) {
                Swal.fire('No se ha efectuado la compra', '', 'info');
            }
        });
    }
}

function limpiarCarritoYProductos() {
    productosEnCarrito = [];
    localStorage.setItem('carrito', JSON.stringify(productosEnCarrito));

    eshop.forEach((elemento) => {
        elemento.cantidad = 0;
    });
    localStorage.setItem('eshop', JSON.stringify(eshop));
}

setTimeout(() => {
    loader.innerHTML = ""
    mostrarCatalogo(eshop)
}, 1000);


document.addEventListener("DOMContentLoaded", function() {
    // Verificar si el usuario está logueado
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    // Rutas que deberían estar protegidas
    const protectedRoutes = ['/pages/menu_usuario.html', '/pages/contacto.html'];

    // Verificar si el usuario está logueado
    if (isLoggedIn) {
        // Si el usuario está logueado, redirigir si está en la página de inicio (index.html)
        if (window.location.pathname === '/index.html') {
            window.location.href = '/pages/menu_usuario.html';
        }
    } else {
        // Si el usuario no está logueado, redirigir a index.html si está en una página protegida
        if (protectedRoutes.includes(window.location.pathname)) {
            window.location.href = '/index.html';
        }
    }
});

// Escuchar el botón de logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
        // Eliminar el estado de sesión de localStorage
        localStorage.removeItem("isLoggedIn");
        // Redirigir al usuario a la página de inicio de sesión
        window.location.href = '/index.html';
    });
}