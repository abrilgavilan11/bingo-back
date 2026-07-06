const express = require('express');
const cors = require('cors');
require('dotenv').config();
const spotifyRoutes = require('./routes/spotifyRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Basic test endpoint
app.get('/', (req, res) => {
  res.json({ status: 'API Bingo Musical funcionando' });
});

// Routes
app.use('/api/spotify', spotifyRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
