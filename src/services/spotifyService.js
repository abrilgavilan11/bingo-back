const axios = require('axios');

let accessToken = null;
let tokenExpirationTime = null;

const getAccessToken = async () => {
  // Check if token is still valid
  if (accessToken && tokenExpirationTime && Date.now() < tokenExpirationTime) {
    return accessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Spotify API credentials in environment variables');
  }

  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const data = new URLSearchParams({
    grant_type: 'client_credentials',
  });

  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const response = await axios.post(tokenUrl, data.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authHeader}`
      }
    });

    accessToken = response.data.access_token;
    // Expira en 'expires_in' segundos. Restamos 60s como margen de seguridad
    tokenExpirationTime = Date.now() + (response.data.expires_in - 60) * 1000;
    
    return accessToken;
  } catch (error) {
    console.error('Error fetching Spotify access token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Spotify API');
  }
};

const getPlaylistTracks = async (playlistId) => {
  const token = await getAccessToken();
  let tracks = [];
  let nextUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`;

  try {
    while (nextUrl) {
      const response = await axios.get(nextUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Filter and map tracks
      const currentTracks = response.data.items
        .filter(item => item.track) // Ignore null tracks (e.g. local files that got removed)
        .map(item => {
          const track = item.track;
          return {
            id: track.id,
            title: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            cover_url: track.album.images.length > 0 ? track.album.images[0].url : null,
            preview_url: track.preview_url
          };
        });

      tracks = [...tracks, ...currentTracks];
      nextUrl = response.data.next;
    }

    return tracks;
  } catch (error) {
    console.error('Error fetching playlist tracks:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      throw new Error('Playlist not found. Make sure it is public and the URL is correct.');
    }
    
    throw new Error('Failed to fetch playlist tracks from Spotify');
  }
};

module.exports = {
  getPlaylistTracks
};
