const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema({
  id: String,
  title: String,
  artist: String,
  image: String
}, { _id: false });

const CardSchema = new mongoose.Schema({
  id: String,
  tracks: [TrackSchema]
}, { _id: false });

const WinnerSchema = new mongoose.Schema({
  type: String, 
  cardId: String,
  playerName: String,
  lineType: String 
}, { _id: false });

const GameSchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true },
  cards: [CardSchema],
  gridSize: { type: Number, required: true },
  playedTracks: [TrackSchema],
  winners: [WinnerSchema],
  createdAt: { type: Date, default: Date.now, expires: 86400 } // Elimina automáticamente el juego en 24hs (86400 segundos)
});

module.exports = mongoose.model('Game', GameSchema);
