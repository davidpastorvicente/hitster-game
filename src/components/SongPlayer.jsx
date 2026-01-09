import { useState, useRef, useEffect } from 'react';
import './SongPlayer.css';

export default function SongPlayer({ song }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [song]);

  const handlePlayClick = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPaused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  return (
    <div className="song-player">
      <h3>🎵 Listen to the Song</h3>
      <audio ref={audioRef} src={song.previewUrl} />
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
