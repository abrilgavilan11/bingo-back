const fetch = global.fetch;
const spotify = require('spotify-url-info')(fetch);

const getPlaylistTracks = async (playlistId) => {
  try {
    const url = `https://open.spotify.com/playlist/${playlistId}`;
    
    const scrapedTracks = await spotify.getTracks(url);

    if (!scrapedTracks || scrapedTracks.length === 0) {
      throw new Error('La playlist está vacía o es privada.');
    }

    const tracks = scrapedTracks.map((track, idx) => {
      const id = track.uri ? track.uri.split(':')[2] : `track-${idx}`;
      return {
        id,
        title: track.name,
        artist: track.artist || (track.artists ? track.artists[0]?.name : 'Desconocido'),
        cover_url: track.cover || track.thumbnail || null,
        preview_url: track.previewUrl || null
      };
    });

    return tracks;
  } catch (error) {
    console.error('Error fetching playlist tracks via spotify-url-info:', error.message);
    throw new Error('No se pudo obtener la playlist. Asegurate de que sea 100% pública y copiada correctamente.');
  }
};

module.exports = {
  getPlaylistTracks
};
