const spotifyService = require('../services/spotifyService');

const getPlaylist = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Playlist URL is required' });
  }

  const match = url.match(/(playlist|album)\/([a-zA-Z0-9]{22})/);
  const type = match ? match[1] : null;
  const playlistId = match ? match[2] : null;

  if (!playlistId) {
    return res.status(400).json({ error: 'La URL no es válida. Debe ser un link de una Playlist o un Álbum de Spotify.' });
  }

  try {
    const tracks = await spotifyService.getPlaylistTracks(playlistId, type);
    
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
