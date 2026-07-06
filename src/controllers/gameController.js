const Game = require('../models/Game');

const generateId = () => Math.random().toString(36).substring(2, 9);

const createGameSession = async (req, res) => {
  try {
    const { cards, gridSize } = req.body;
    if (!cards || !Array.isArray(cards)) {
      return res.status(400).json({ error: 'Valid cards array is required' });
    }

    const gameId = generateId();
    const newGame = new Game({
      gameId,
      cards,
      gridSize,
      playedTracks: [],
      winners: []
    });

    await newGame.save();
    res.json({ success: true, gameId });
  } catch (error) {
    console.error('Error creating game session:', error);
    res.status(500).json({ error: 'Error creating game session' });
  }
};

const getCard = async (req, res) => {
  try {
    const { gameId, cardId } = req.params;

    const game = await Game.findOne({ gameId });
    if (!game) {
      return res.status(404).json({ error: 'Sesión de juego no encontrada o expirada.' });
    }

    const card = game.cards.find(c => c.id === cardId);
    if (!card) {
      return res.status(404).json({ error: 'Cartón no encontrado.' });
    }

    res.json({ success: true, card, gridSize: game.gridSize });
  } catch (error) {
    console.error('Error getting card:', error);
    res.status(500).json({ error: 'Error getting card' });
  }
};

const getGameState = async (gameId) => {
  try {
    const game = await Game.findOne({ gameId });
    if (!game) return null;
    return {
      playedTracks: game.playedTracks,
      winners: game.winners
    };
  } catch (error) {
    console.error('Error getting game state:', error);
    return null;
  }
};

const addPlayedTrack = async (gameId, track) => {
  try {
    const game = await Game.findOne({ gameId });
    if (game && !game.playedTracks.some(t => t.id === track.id)) {
      game.playedTracks.unshift(track);
      await game.save();
    }
  } catch (error) {
    console.error('Error adding played track:', error);
  }
};

const addWinner = async (gameId, winnerData) => {
  try {
    const game = await Game.findOne({ gameId });
    if (game) {
      const exists = game.winners.some(w => w.cardId === winnerData.cardId && w.type === winnerData.type);
      if (!exists) {
        game.winners.push(winnerData);
        await game.save();
      }
    }
  } catch (error) {
    console.error('Error adding winner:', error);
  }
};

module.exports = {
  createGameSession,
  getCard,
  getGameState,
  addPlayedTrack,
  addWinner
};
