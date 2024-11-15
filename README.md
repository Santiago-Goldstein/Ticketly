# 🎫 Ticketly

Bienvenido al repositorio de **Ticketly**. Esta aplicación permite a los usuarios explorar, comprar y gestionar entradas para una variedad de eventos en vivo, como conciertos, obras de teatro y festivales. 

## 🗂️ Descripción 
Es una aplicación web ligera y rápida para la compra de entradas a eventos. Los usuarios pueden navegar por los eventos, ver detalles, seleccionar entradas y gestionar su pedido de forma sencilla y rapida. 

## 🛠️ Características
- **Exploración de eventos**: Interfaz intuitiva para explorar eventos con información como la fecha, el lugar y el precio.
- **Selección de entradas**: Posibilidad de seleccionar el tipo y cantidad de entradas.
- **Proceso de compra**: Simulación de un flujo de compra básico.
- **Perfil de usuario**: Gestión de datos básicos y visualización de eventos comprados.
- **Diseño adaptable**: Interfaz adaptable para uso en dispositivos móviles y de escritorio.

## 🚀 Instalación
Para utilizar este proyecto en tu entorno local:

1) Clona este repositorio:

```bash
$ git clone https://github.com/tu_usuario/ticketera-shows.git
$ cd ticketera-shows
```

2) Descarga la libreria Flask:

- Windows: pip install flask
- Mac: pip3 install flask (En mac algunas veces hay que descargar una libreria adicional para permisos CORS) - pip3 install flask-cors

3) Ejecuta la aplicación

- Es necesario encender un servidor, para iniciarlo ve a la carpeta /server en la terminal y escribe: python app.py... Listo!, solo abre el index.html.
- Si prefieres un servidor local para desarrollo, puedes utilizar Live Server en VS Code o ejecutar el siguiente comando en tu terminal:

```bash
npx http-server .
```

- Una vez abierto el archivo index.html, podrás ver la aplicación en tu navegador y comenzar a interactuar con ella.

## Usuarios creados

- Username: admin
- Password: 123

## 📁 Estructura del Proyecto
index.html – Página principal de la aplicación.
css/ – Carpeta que contiene los archivos CSS para el diseño de la aplicación.
css/styles.css – Estilos principales.
js/ – Carpeta que contiene los archivos JavaScript para la funcionalidad.
js/scripts.js – Lógica principal para la aplicación.
pages/ – Carpeta que contiene las páginas de la web.
pages/menu_usuario.html – Página de usuario logueado.
server/ – Carpeta que contiene el servidor flask y la base de datos de usuarios

## 🧑‍💻 Tecnologías Utilizadas
- HTML – Estructura de la aplicación.
- CSS – Estilos y diseño de la interfaz.
- JavaScript – Lógica para la aplicación.
- Python – Servidor flask.

## Bootstrap base
https://startbootstrap.com/previews/shop-homepage