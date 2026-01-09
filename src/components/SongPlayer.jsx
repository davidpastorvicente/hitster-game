import './SongPlayer.css';

export default function SongPlayer({ song }) {
  const embedUrl = `https://www.youtube.com/embed/${song.youtubeId}?autoplay=1`;

  return (
    <div className="song-player">
      <h3>🎵 Listen to the Song</h3>
      <div className="video-container">
        <iframe
          width="100%"
          height="315"
          src={embedUrl}
          title={song.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="song-hint">
        <p>Guess when this song was released and place it in your timeline!</p>
      </div>
    </div>
  );
}
