const express = require('express');
const cors = require('cors');
require('dotenv').config();
const spotifyRoutes = require('./routes/spotifyRoutes');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'API Bingo Musical funcionando' });
});

app.use('/api/spotify', spotifyRoutes);
app.use('/api/game', gameRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
