const spotifyService = require('../services/spotifyService');

const getPlaylist = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Playlist URL is required' });
  }

  const match = url.match(/playlist\/([a-zA-Z0-9]{22})/);
  const playlistId = match ? match[1] : null;

  if (!playlistId) {
    return res.status(400).json({ error: 'La URL de la playlist no es válida o está incompleta. Debe contener un ID de 22 caracteres.' });
  }

  try {
    const tracks = await spotifyService.getPlaylistTracks(playlistId);
    
    res.json({
      success: true,
      playlistId,
      totalTracks: tracks.length,
      tracks
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPlaylist
};
