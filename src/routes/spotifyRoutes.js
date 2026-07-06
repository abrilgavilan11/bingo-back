const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotifyController');

// POST /api/spotify/playlist
router.post('/playlist', spotifyController.getPlaylist);

module.exports = router;
