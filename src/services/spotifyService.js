import axios from 'axios';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

let accessToken = null;
let tokenExpiry = null;

// Get Spotify access token
export async function getAccessToken() {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
      }
    );

    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000;
    return accessToken;
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    throw error;
  }
}

// Search for popular songs from a specific year
export async function searchSongsByYear(year, limit = 50) {
  try {
    const token = await getAccessToken();
    
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: `year:${year}`,
        type: 'track',
        limit: limit,
        market: 'US',
      },
    });

    return response.data.tracks.items
      .filter(track => track.preview_url) // Only songs with preview
      .map(track => ({
        id: track.id,
        title: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        year: parseInt(track.album.release_date.substring(0, 4)),
        previewUrl: track.preview_url,
        albumCover: track.album.images[0]?.url,
        popularity: track.popularity,
      }));
  } catch (error) {
    console.error('Error searching songs:', error);
    return [];
  }
}

// Get random popular songs from different decades (1960-2025)
export async function getRandomPopularSongs(count = 35) {
  const songs = [];
  const years = [];
  
  // Generate random years between 1960 and 2025
  for (let i = 0; i < count; i++) {
    const year = Math.floor(Math.random() * (2025 - 1960 + 1)) + 1960;
    years.push(year);
  }

  try {
    const token = await getAccessToken();
    
    // Search for popular songs from random years
    for (const year of years) {
      try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            q: `year:${year}`,
            type: 'track',
            limit: 10,
            market: 'US',
          },
        });

        const tracks = response.data.tracks.items
          .filter(track => track.preview_url && track.popularity > 50)
          .map(track => ({
            id: track.id,
            title: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            year: parseInt(track.album.release_date.substring(0, 4)),
            previewUrl: track.preview_url,
            albumCover: track.album.images[0]?.url,
            popularity: track.popularity,
          }));

        if (tracks.length > 0) {
          // Pick the most popular track
          tracks.sort((a, b) => b.popularity - a.popularity);
          songs.push(tracks[0]);
        }
      } catch (error) {
        console.error(`Error fetching songs for year ${year}:`, error);
      }
    }

    return songs;
  } catch (error) {
    console.error('Error getting random popular songs:', error);
    return [];
  }
}

// Get a curated list of iconic songs (fallback/preset mode)
export async function getCuratedSongs() {
  const iconicSongs = [
    { artist: 'The Beatles', track: 'Hey Jude', year: 1968 },
    { artist: 'Queen', track: 'Bohemian Rhapsody', year: 1975 },
    { artist: 'Michael Jackson', track: 'Billie Jean', year: 1983 },
    { artist: 'Nirvana', track: 'Smells Like Teen Spirit', year: 1991 },
    { artist: 'Adele', track: 'Rolling in the Deep', year: 2010 },
    { artist: 'The Weeknd', track: 'Blinding Lights', year: 2020 },
    { artist: 'Beyoncé', track: 'Crazy in Love', year: 2003 },
    { artist: 'Oasis', track: 'Wonderwall', year: 1995 },
    { artist: 'Led Zeppelin', track: 'Stairway to Heaven', year: 1971 },
    { artist: 'Eagles', track: 'Hotel California', year: 1977 },
  ];

  const songs = [];
  const token = await getAccessToken();

  for (const song of iconicSongs) {
    try {
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: `artist:${song.artist} track:${song.track}`,
          type: 'track',
          limit: 1,
          market: 'US',
        },
      });

      if (response.data.tracks.items.length > 0) {
        const track = response.data.tracks.items[0];
        if (track.preview_url) {
          songs.push({
            id: track.id,
            title: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            year: song.year,
            previewUrl: track.preview_url,
            albumCover: track.album.images[0]?.url,
            popularity: track.popularity,
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching ${song.track}:`, error);
    }
  }

  return songs;
}
