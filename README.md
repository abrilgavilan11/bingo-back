<div align="center">
  <h1>🎛️ Bingo Musical - API (Backend)</h1>
  
  ## El motor lógico y de tiempo real que le da vida al Bingo Musical.

  <p>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Socket.io_Server-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io" />
    <img src="https://img.shields.io/badge/Spotify_API-1ED760?style=for-the-badge&logo=spotify&logoColor=white" alt="Spotify API" />
  </p>
</div>

---

## 💡 Sobre el Backend

Esta es la capa lógica (servidor) del proyecto **Bingo Musical**. Desarrollada puramente en **Node.js** con el framework **Express**, su función es encargarse del procesamiento pesado: desde conectarse de forma segura con la API de Spotify hasta orquestar la compleja lógica matemática que evita los cartones repetidos.

Al mismo tiempo, implementa **WebSockets** a través de Socket.io para permitir la comunicación bidireccional instantánea entre el animador del bingo y los múltiples jugadores conectados simultáneamente desde sus dispositivos.

---

## ✨ Funcionalidades y Lógica Central

* **🔗 Spotify API Wrapper:** Implementa el *Client Credentials Flow* de OAuth 2.0 para autenticarse de manera segura con los servidores de Spotify y extraer metadatos masivos de playlists de forma rápida, sorteando paginaciones.
* **🎲 Motor Matemático (Generador de Cartones):** 
  * Un avanzado algoritmo de generación de cartones basado en variaciones aleatorias (*Fisher-Yates Shuffle*).
  * Lógica de balanceo para asegurarse de que las canciones estén distribuidas de manera que los participantes no griten bingo todos exactamente al mismo tiempo.
* **⚡ Servidor WebSockets (Socket.io):** 
  * **Sistema de Salas (Rooms):** Aísla los eventos de tiempo real asegurándose de que una jugada en la sala A no interfiera con una partida en la sala B.
  * Emisión de eventos estructurados: Sorteo de canciones (`draw-song`), nuevas conexiones, validación y disparo de ganadores de línea o cartón lleno (`winner-alert`).
* **💾 Persistencia con MongoDB:** Modelado estructurado a través de *Mongoose* para persistir IDs de juegos únicos, la matriz y estado de las canciones sorteadas y la identidad de los cartones generados, asegurando que el estado del juego se mantenga incluso si un cliente se desconecta y vuelve a conectarse.

---

## 🛠️ Stack Tecnológico (Backend)

* **Entorno:** Node.js
* **Framework:** Express.js
* **Base de Datos:** MongoDB (Object Data Modeling usando Mongoose)
* **Tiempo Real:** Socket.io
* **Servicios Externos:** Axios para requests HTTP contra la Spotify Web API.
* **Seguridad & CORS:** Manejo de orígenes cruzados configurado para sincronizar el cliente de React en desarrollo y producción.

---

## 🚀 Instalación y Puesta en Marcha (Backend)

Para correr el servidor en tu entorno local:

### 1. Configuración de Variables de Entorno
Necesitás registrarte en el [Spotify Developer Dashboard](https://developer.spotify.com/) para conseguir tus credenciales de aplicación.

En la carpeta raíz de este repositorio (`bingo-back`), creá un archivo `.env` y agregá:

```env
PORT=3001
MONGODB_URI=tu_url_de_conexion_de_mongodb
SPOTIFY_CLIENT_ID=tu_cliente_id_de_spotify
SPOTIFY_CLIENT_SECRET=tu_secreto_de_spotify
```

### 2. Iniciar el Servidor
Abrí una terminal en esta carpeta y ejecutá:
```bash
npm install
npm run dev
```

El servidor quedará a la escucha en el puerto 3001 (o el puerto que definiste) esperando requests de tu frontend.

---
<div align="center">
  <b>Diseñado y desarrollado por <a href="https://github.com/abrilgavilan11">Abril Gavilan</a></b>
</div>
