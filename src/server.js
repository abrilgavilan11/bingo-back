const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
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

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'API Bingo Musical funcionando' });
});

app.use('/api/spotify', spotifyRoutes);
app.use('/api/game', gameRoutes);

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  socket.on('join-room', (gameId) => {
    socket.join(gameId);
    console.log(`Socket ${socket.id} unido a sala ${gameId}`);
    
    const state = gameController.getGameState(gameId);
    if (state) {
      socket.emit('sync-state', state);
    }
  });

  socket.on('draw-song', ({ gameId, track }) => {
    gameController.addPlayedTrack(gameId, track);
    io.to(gameId).emit('next-song', track);
  });

  socket.on('line-bingo', ({ gameId, cardId, playerName, lineType }) => {
    const winner = { type: 'LÍNEA', cardId, playerName, lineType };
    gameController.addWinner(gameId, winner);
    io.to(gameId).emit('winner-alert', winner);
  });

  socket.on('full-bingo', ({ gameId, cardId, playerName }) => {
    const winner = { type: 'BINGO', cardId, playerName };
    gameController.addWinner(gameId, winner);
    io.to(gameId).emit('winner-alert', winner);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
