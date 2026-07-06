const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.post('/', gameController.createGameSession);

router.get('/:gameId/card/:cardId', gameController.getCard);

module.exports = router;
