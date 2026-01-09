import { useState, useEffect, useCallback } from 'react';
import { getCuratedSongs } from '../services/spotifyService';
import Timeline from './Timeline';
import SongPlayer from './SongPlayer';
import PlacementButtons from './PlacementButtons';
import './GameBoard.css';

export default function GameBoard({ teams, winningScore }) {
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);
  const [teamTimelines, setTeamTimelines] = useState(
    teams.map(() => [])
  );
  const [availableSongs, setAvailableSongs] = useState([]);
  const [usedSongIds, setUsedSongIds] = useState([]);
  const [gamePhase, setGamePhase] = useState('loading');
  const [lastPlacement, setLastPlacement] = useState(null);
  const [scores, setScores] = useState(teams.map(() => 0));
  const [winner, setWinner] = useState(null);

  const drawNewSong = useCallback((songs, usedIds) => {
    const availableToPlay = songs.filter(song => !usedIds.includes(song.id));

    if (availableToPlay.length === 0) {
      setGamePhase('gameOver');
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableToPlay.length);
    const song = availableToPlay[randomIndex];

    setCurrentSong(song);
    setUsedSongIds([...usedIds, song.id]);
    setGamePhase('playing');
    setLastPlacement(null);
  }, []);

  const loadSongs = useCallback(async () => {
    try {
      setGamePhase('loading');
      const songs = await getCuratedSongs();
      setAvailableSongs(songs);
      if (songs.length > 0) {
        drawNewSong(songs, []);
      } else {
        setGamePhase('error');
      }
    } catch (error) {
      console.error('Error loading songs:', error);
      setGamePhase('error');
    }
  }, [drawNewSong]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadSongs();
  }, [loadSongs]);

  const handlePlacement = (position) => {
    const currentTimeline = teamTimelines[currentTeamIndex];
    const newTimeline = [...currentTimeline];
    
    newTimeline.splice(position, 0, currentSong);
    
    const isCorrect = checkIfCorrectPlacement(newTimeline);
    
    if (isCorrect) {
      const updatedTimelines = [...teamTimelines];
      updatedTimelines[currentTeamIndex] = newTimeline;
      setTeamTimelines(updatedTimelines);
      
      const newScores = [...scores];
      newScores[currentTeamIndex]++;
      setScores(newScores);
      
      setLastPlacement({ correct: true, position });
      
      if (newScores[currentTeamIndex] >= winningScore) {
        setWinner(currentTeamIndex);
        setGamePhase('gameOver');
        return;
      }
    } else {
      setLastPlacement({ correct: false, position });
    }
    
    setGamePhase('result');
  };

  const checkIfCorrectPlacement = (timeline) => {
    for (let i = 0; i < timeline.length - 1; i++) {
      if (timeline[i].year > timeline[i + 1].year) {
        return false;
      }
    }
    return true;
  };

  const handleNextTurn = () => {
    const nextTeamIndex = (currentTeamIndex + 1) % teams.length;
    setCurrentTeamIndex(nextTeamIndex);
    drawNewSong(availableSongs, usedSongIds);
  };

  const currentTeam = teams[currentTeamIndex];
  const currentTimeline = teamTimelines[currentTeamIndex];

  return (
    <div className="game-board">
      <div className="game-header">
        <h1>🎵 Hitster</h1>
        <div className="scores">
          {teams.map((team, index) => (
            <div 
              key={index} 
              className={`score ${index === currentTeamIndex ? 'active' : ''}`}
            >
              <span className="team-name">{team}</span>
              <span className="score-value">{scores[index]} / {winningScore} songs</span>
            </div>
          ))}
        </div>
      </div>

      {gamePhase === 'loading' && (
        <div className="loading-screen">
          <div className="loading-content">
            <h2>🎵 Loading Songs from Spotify...</h2>
            <div className="loading-spinner"></div>
          </div>
        </div>
      )}

      {gamePhase === 'error' && (
        <div className="error-screen">
          <div className="error-content">
            <h2>❌ Error Loading Songs</h2>
            <p>Please check your Spotify API credentials and try again.</p>
            <button className="retry-button" onClick={loadSongs}>
              Retry
            </button>
          </div>
        </div>
      )}

      {gamePhase === 'gameOver' && winner !== null && (
        <div className="game-over">
          <div className="winner-announcement">
            <h2>🎉 Game Over! 🎉</h2>
            <h1>{teams[winner]} Wins!</h1>
            <p>They reached {winningScore} songs in their timeline!</p>
            <div className="final-timeline">
              <h3>Winning Timeline:</h3>
              <Timeline timeline={teamTimelines[winner]} showYears={true} />
            </div>
            <button className="play-again-button" onClick={() => window.location.reload()}>
              Play Again
            </button>
          </div>
        </div>
      )}

      {gamePhase !== 'gameOver' && gamePhase !== 'loading' && gamePhase !== 'error' && (
        <>
          <div className="current-turn">
            <h2>Current Turn: {currentTeam}</h2>
          </div>

      {currentSong && gamePhase === 'playing' && (
        <div className="song-section">
          <SongPlayer song={currentSong} />
          <div className="timeline-container">
            <h3>Your Timeline:</h3>
            <Timeline timeline={currentTimeline} showYears={true} />
            <PlacementButtons 
              timeline={currentTimeline}
              onPlacement={handlePlacement}
            />
          </div>
        </div>
      )}

      {gamePhase === 'result' && lastPlacement && (
        <div className="result-section">
          <div className={`result-message ${lastPlacement.correct ? 'correct' : 'incorrect'}`}>
            {lastPlacement.correct ? (
              <>
                <h2>✅ Correct!</h2>
                <p>{currentSong.title} ({currentSong.year}) has been added to your timeline!</p>
              </>
            ) : (
              <>
                <h2>❌ Wrong!</h2>
                <p>{currentSong.title} was released in <b>{currentSong.year}</b></p>
                <p>Better luck next time!</p>
              </>
            )}
          </div>
          
          <div className="timeline-container">
            <h3>{currentTeam}'s Timeline:</h3>
            <Timeline timeline={teamTimelines[currentTeamIndex]} showYears={true} />
          </div>

          <button className="next-turn-button" onClick={handleNextTurn}>
            Next Turn
          </button>
        </div>
      )}
      </>
      )}
    </div>
  );
}
