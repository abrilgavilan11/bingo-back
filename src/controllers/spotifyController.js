const spotifyService = require('../services/spotifyService');

const getPlaylist = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Playlist URL is required' });
  }

  // Extract ID from URL
  // Example: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=123
  const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
  const playlistId = match ? match[1] : null;

  if (!playlistId) {
    return res.status(400).json({ error: 'Invalid Spotify playlist URL' });
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
