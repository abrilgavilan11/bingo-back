const games = new Map();

const generateId = () => Math.random().toString(36).substring(2, 9);

const createGameSession = (req, res) => {
  const { cards, gridSize } = req.body;
  if (!cards || !Array.isArray(cards)) {
    return res.status(400).json({ error: 'Valid cards array is required' });
  }

  const gameId = generateId();
  games.set(gameId, { 
    cards, 
    gridSize, 
    createdAt: Date.now(),
    playedTracks: [],
    winners: []
  });

  for (const [key, value] of games.entries()) {
    if (Date.now() - value.createdAt > 24 * 60 * 60 * 1000) {
      games.delete(key);
    }
  }

  res.json({ success: true, gameId });
};

const getCard = (req, res) => {
  const { gameId, cardId } = req.params;

  const game = games.get(gameId);
  if (!game) {
    return res.status(404).json({ error: 'Sesión de juego no encontrada o expirada.' });
  }

  const card = game.cards.find(c => c.id === cardId);
  if (!card) {
    return res.status(404).json({ error: 'Cartón no encontrado.' });
  }

  res.json({ success: true, card, gridSize: game.gridSize });
};

const getGameState = (gameId) => {
  const game = games.get(gameId);
  if (!game) return null;
  return {
    playedTracks: game.playedTracks,
    winners: game.winners
  };
};

const addPlayedTrack = (gameId, track) => {
  const game = games.get(gameId);
  if (game && !game.playedTracks.some(t => t.id === track.id)) {
    game.playedTracks.unshift(track);
  }
};

const addWinner = (gameId, winnerData) => {
  const game = games.get(gameId);
  if (game) {
    const exists = game.winners.some(w => w.cardId === winnerData.cardId && w.type === winnerData.type);
    if (!exists) {
      game.winners.push(winnerData);
    }
  }
};

module.exports = {
  createGameSession,
  getCard,
  getGameState,
  addPlayedTrack,
  addWinner
};
