<div align="center">
  <img src="./bingo-front/src/assets/bingo-musical_logo.svg" alt="Logo de Bingo Musical" width="400" />
  
  ## La plataforma web definitiva para generar, imprimir y jugar bingos musicales interactivos en tiempo real con Spotify.

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Spotify_API-1ED760?style=for-the-badge&logo=spotify&logoColor=white" alt="Spotify API" />
  </p>
</div>

---

## 💡 Sobre el Proyecto

**Bingo Musical** es una aplicación full-stack diseñada para transformar cualquier reunión, cumpleaños o evento en una fiesta épica. Olvidate de armar cartones a mano o de lidiar con canciones repetidas: simplemente pegá el enlace de cualquier playlist pública de **Spotify**, elegí la cantidad de jugadores, ¡y la plataforma se encarga del resto!

Ofrece una experiencia híbrida: podés generar cartones optimizados para imprimir en papel o permitir que tus invitados jueguen desde sus celulares en tiempo real escaneando un código QR.

---

## ✨ Características Principales

* **🔗 Integración Mágica con Spotify:** Conexión directa mediante *Client Credentials Flow* para extraer títulos, artistas, carátulas y previews de audio de cualquier playlist en segundos.
* **🎲 Motor Matemático Anti-Repetición:** Algoritmo *Fisher-Yates Shuffle* que garantiza cartones únicos y equilibrados para evitar ganadores simultáneos prematuros.
* **⚡ Jugabilidad en Tiempo Real (Socket.io):** 
  * **Bolillero Live:** Panel para el animador con sorteador de canciones e historial en vivo.
  * **Alerta Express:** Los jugadores reciben un aviso visual en sus celulares si hicieron línea o bingo, con decoraciones festivas.
  * **Podio en Vivo:** Sistema de validación automática para múltiples ganadores (Línea y Bingo de Cartón Lleno).
* **🎵 Reproductor Integrado (In-App Player):** Reproduce los audios de muestra directamente desde el panel del animador para cantar en el momento sin salir de la app.
* **📱 Cartones Digitales vía Link:** Los invitados pueden ingresar un enlace para unirse a la sala interactiva, agregar su nombre y tachar casilleros desde su pantalla con feedback visual y animaciones.
* **🖨️ Smart Layout A4:** Vista previa de impresión formateada si decidís imprimir los cartones y repartirlos físicamente.
* **📖 Guía Didáctica (Cómo Jugar):** Una sección interactiva e ilustrada incorporada dentro de la app que le explica fácilmente a cualquiera cómo iniciar su primera partida.

---

## 🎨 Motor de Plantillas (Theming Engine)

Personalizá la estética de tus cartones con un solo clic gracias a nuestro sistema de temas impulsado por **Tailwind CSS**:

| Tema | Estilo Visual | Vibe / Ideal para... |
| :--- | :--- | :--- |
| **🕹️ Synthwave Neón** | Fondos oscuros, bordes brillantes rosa y cian, fuentes retro arcade. | Fiestas pop de los 80s/90s, previa con amigos. |
| **🌴 Fiesta Tropical** | Tonos cálidos y vibrantes, bordes redondeados y estilo veraniego. | Cumbia, reggaeton, cumpleaños al aire libre o pool parties. |
| **✨ Aesthetic Limpio** | Fondo blanco impecable, líneas finas y tipografía Serif elegante. | Eventos formales, casamientos o máximo ahorro de tinta. |
| **🎟️ Ticket de Festival** | Simula la entrada o credencial de backstage de un recital con código de barras. | Fanáticos del rock, indie o temáticas de conciertos. |

---

## 🛠️ Stack Tecnológico

* **Frontend (Cliente UI):** React.js (Vite), Tailwind CSS, Framer Motion, Lucide Icons, Socket.io-client.
* **Backend (Servidor):** Node.js, Express, MongoDB (Mongoose), Socket.io, Spotify Web API (REST).
* **Despliegue (Deploy):** Preparado para entornos como Vercel (Front) y Render/Heroku (Back).

---

## 🚀 Instalación y Puesta en Marcha

Seguí estos pasos para correr el proyecto localmente en tu entorno de desarrollo.

### 1. Clonar el repositorio
```bash
git clone https://github.com/abrilgavilan11/BingoMusical-ByAbru.git
cd BingoMusical-ByAbru
```

### 2. Levantar el Servidor Backend
Abrí una terminal y corré los siguientes comandos:
```bash
cd bingo-back
npm install
```
Creá un archivo `.env` en la carpeta `bingo-back` y agregá tus variables de entorno:
```env
PORT=3001
MONGODB_URI=tu_url_de_mongodb
SPOTIFY_CLIENT_ID=tu_cliente_id_de_spotify
SPOTIFY_CLIENT_SECRET=tu_secreto_de_spotify
```
Iniciá el backend:
```bash
npm run dev
```

### 3. Levantar la Interfaz Frontend
Abrí otra terminal y corré:
```bash
cd bingo-front
npm install
```
Creá un archivo `.env` en la carpeta `bingo-front` apuntando a tu backend local:
```env
VITE_API_URL=http://localhost:3001
```
Iniciá el frontend:
```bash
npm run dev
```

¡Listo! La aplicación debería abrirse automáticamente en tu navegador o podés acceder mediante `http://localhost:5173`.

---

<div align="center">
  <b>Diseñado y desarrollado por <a href="https://github.com/abrilgavilan11">Abril Gavilan</a></b>
</div>
