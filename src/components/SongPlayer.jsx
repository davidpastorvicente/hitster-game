import { useState, useRef } from 'react';
import './SongPlayer.css';

export default function SongPlayer({ song }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const iframeRef = useRef(null);

  const handlePlayClick = () => {
    setIsPlaying(true);
    setIsPaused(false);
  };

  const togglePlayPause = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      if (isPaused) {
        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      } else {
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
      setIsPaused(!isPaused);
    }
  };

  const embedUrl = `https://www.youtube.com/embed/${song.youtubeId}?autoplay=1&controls=0&modestbranding=1&showinfo=0&rel=0&enablejsapi=1`;

  return (
    <div className="song-player">
      <h3>🎵 Listen to the Song</h3>
      <div className="audio-container">
        {!isPlaying ? (
          <div className="play-button-container">
            <button className="play-button" onClick={handlePlayClick}>
              <span className="play-icon">▶</span>
              <span>Play Song</span>
            </button>
            <p className="play-hint">Click to play the mystery song!</p>
          </div>
        ) : (
          <div className="hidden-player">
            <iframe
              ref={iframeRef}
              width="100%"
              height="0"
              src={embedUrl}
              title="Song Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={{ display: 'none' }}
            ></iframe>
            <div className="now-playing">
              <div className={`music-bars ${isPaused ? 'paused' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>{isPaused ? '⏸️ Paused' : '🎵 Now Playing... 🎵'}</p>
              <button className="control-button" onClick={togglePlayPause}>
                {isPaused ? '▶ Play' : '⏸ Pause'}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="song-hint">
        <p>Guess when this song was released and place it in your timeline!</p>
      </div>
    </div>
  );
}
