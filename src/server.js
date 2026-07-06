const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

const spotifyRoutes = require('./routes/spotifyRoutes');
const gameRoutes = require('./routes/gameRoutes');
const gameController = require('./controllers/gameController');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => console.error('Error conectando a MongoDB:', err));
} else {
  console.warn('ADVERTENCIA: No se encontró MONGODB_URI en .env. El backend no se conectará a la base de datos.');
}

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'API Bingo Musical funcionando' });
});

app.use('/api/spotify', spotifyRoutes);
app.use('/api/game', gameRoutes);

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('join-room', async (gameId) => {
    socket.join(gameId);
    console.log(`Socket ${socket.id} unido a sala ${gameId}`);
    
    const state = await gameController.getGameState(gameId);
    if (state) {
      socket.emit('sync-state', state);
    }
  });

  socket.on('draw-song', async ({ gameId, track }) => {
    await gameController.addPlayedTrack(gameId, track);
    io.to(gameId).emit('next-song', track);
  });

  socket.on('line-bingo', async ({ gameId, cardId, playerName, lineType }) => {
    const winner = { type: 'LÍNEA', cardId, playerName, lineType };
    const success = await gameController.addWinner(gameId, winner);
    if (success) {
      io.to(gameId).emit('winner-alert', winner);
    }
  });

  socket.on('full-bingo', async ({ gameId, cardId, playerName }) => {
    const winner = { type: 'BINGO', cardId, playerName };
    const success = await gameController.addWinner(gameId, winner);
    if (success) {
      io.to(gameId).emit('winner-alert', winner);
    }
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
