/**
 * Fetch fresh Deezer preview URL and album cover for a song.
 * Preview URLs expire after ~24h, so we fetch them at runtime.
 * Album covers are permanent and can be used from cached data.
 * 
 * @param {Object} song - Song object with deezerId and optional albumCover
 * @returns {Object} Object with previewUrl and albumCover
 */
export async function fetchDeezerPreview(song) {
  let previewUrl = null;
  let albumCover = song.albumCover || null; // Album covers are permanent
  
  if (song.deezerId) {
    try {
      const corsProxy = 'https://corsproxy.io/?';
      const response = await fetch(`${corsProxy}https://api.deezer.com/track/${song.deezerId}`);
      const data = await response.json();
      if (data.preview) {
        previewUrl = data.preview;
        if (!albumCover && data.album?.cover_medium) {
          albumCover = data.album.cover_medium;
        }
      }
    } catch (error) {
      console.warn('Failed to fetch Deezer preview, falling back to YouTube:', error);
    }
  }
  
  // Fallback to YouTube if no Deezer preview
  if (!previewUrl) {
    previewUrl = `https://www.youtube.com/embed/${song.youtubeId}?autoplay=1&controls=0`;
  }

  return { previewUrl, albumCover };
}
