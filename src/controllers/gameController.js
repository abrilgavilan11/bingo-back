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
    if (!game) {
      console.log('Game not found:', gameId);
      return false;
    }

    const winnersOfType = game.winners.filter(w => w.type === winnerData.type);
    
    const alreadyWonThisType = winnersOfType.some(w => w.cardId === winnerData.cardId);
    if (alreadyWonThisType) {
      console.log('Already won this type:', winnerData);
      return false;
    }

    let canWin = false;
    if (winnerData.type === 'LÍNEA' && winnersOfType.length < 2) {
      canWin = true;
    } else if (winnerData.type === 'BINGO' && winnersOfType.length < 1) {
      canWin = true;
    }

    if (canWin) {
      game.winners.push(winnerData);
      await game.save();
      console.log('Winner added successfully:', winnerData);
      return true; 
    }
    
    console.log('Cannot win, limits reached for type:', winnerData.type);
    return false;
  } catch (error) {
    console.error('Error adding winner:', error);
    return false;
  }
};

const clearWinners = async (gameId) => {
  try {
    await Game.updateOne({ gameId }, { $set: { winners: [] } });
    return true;
  } catch (error) {
    console.error('Error clearing winners:', error);
    return false;
  }
};

const WINNING_LINES = {
  9: [
    [0,1,2], [3,4,5], [6,7,8], 
    [0,3,6], [1,4,7], [2,5,8], 
    [0,4,8], [2,4,6]           
  ],
  16: [
    [0,1,2,3], [4,5,6,7], [8,9,10,11], [12,13,14,15],
    [0,4,8,12], [1,5,9,13], [2,6,10,14], [3,7,11,15],
    [0,5,10,15], [3,6,9,12]                           
  ]
};

const getLineType = (index, size) => {
  const is4x4 = size === 16;
  if (is4x4) {
    if (index < 4) return 'Horizontal';
    if (index < 8) return 'Vertical';
    return 'Diagonal';
  } else {
    if (index < 3) return 'Horizontal';
    if (index < 6) return 'Vertical';
    return 'Diagonal';
  }
};

const checkAutoWinners = async (gameId) => {
  try {
    const game = await Game.findOne({ gameId });
    if (!game) return [];
    
    const playedTrackIds = new Set(game.playedTracks.map(t => t.id));
    const newWinners = [];

    const lineaWinners = game.winners.filter(w => w.type === 'LÍNEA');
    const bingoWinners = game.winners.filter(w => w.type === 'BINGO');
    
    for (const card of game.cards) {
      const size = card.tracks.length;
      const lines = WINNING_LINES[size];
      
      const markedIndices = new Set();
      card.tracks.forEach((track, idx) => {
        if (playedTrackIds.has(track.id)) {
          markedIndices.add(idx);
        }
      });

      const isBingoWinnerAlready = bingoWinners.some(w => w.cardId === card.id);
      const bingoCount = bingoWinners.length + newWinners.filter(w => w.type === 'BINGO').length;
      if (!isBingoWinnerAlready && bingoCount < 1) {
        let isFull = true;
        for (let i = 0; i < size; i++) {
          if (!markedIndices.has(i)) {
            isFull = false;
            break;
          }
        }
        if (isFull) {
          const winnerData = { type: 'BINGO', cardId: card.id, playerName: 'Desconocido', lineType: null };
          game.winners.push(winnerData);
          newWinners.push(winnerData);
        }
      }

      const isLineaWinnerAlready = lineaWinners.some(w => w.cardId === card.id);
      const lineaCount = lineaWinners.length + newWinners.filter(w => w.type === 'LÍNEA').length;
      if (!isLineaWinnerAlready && lineaCount < 2) {
        let wonLine = false;
        let wonLineIndex = -1;
        lines.forEach((line, index) => {
          if (!wonLine) {
            const isLineComplete = line.every(idx => markedIndices.has(idx));
            if (isLineComplete) {
              wonLine = true;
              wonLineIndex = index;
            }
          }
        });
        
        if (wonLine) {
          const lineType = getLineType(wonLineIndex, size);
          const winnerData = { type: 'LÍNEA', cardId: card.id, playerName: 'Desconocido', lineType };
          game.winners.push(winnerData);
          newWinners.push(winnerData);
        }
      }
    }
    
    if (newWinners.length > 0) {
      await game.save();
    }
    
    return newWinners;
  } catch (error) {
    console.error('Error auto checking winners:', error);
    return [];
  }
};

module.exports = {
  createGameSession,
  getCard,
  getGameState,
  addPlayedTrack,
  addWinner,
  clearWinners,
  checkAutoWinners
};
