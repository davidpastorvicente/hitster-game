import { useState } from 'react';
import './GameSetup.css';

export default function GameSetup({ onStartGame }) {
  const [numTeams, setNumTeams] = useState(2);
  const [teamNames, setTeamNames] = useState(['Team 1', 'Team 2']);
  const [winningScore, setWinningScore] = useState(10);

  const handleNumTeamsChange = (num) => {
    setNumTeams(num);
    const newTeamNames = Array.from({ length: num }, (_, i) => 
      teamNames[i] || `Team ${i + 1}`
    );
    setTeamNames(newTeamNames);
  };

  const handleTeamNameChange = (index, name) => {
    const newTeamNames = [...teamNames];
    newTeamNames[index] = name;
    setTeamNames(newTeamNames);
  };

  const handleStart = () => {
    onStartGame(teamNames, winningScore);
  };

  return (
    <div className="game-setup">
      <h1>🎵 Hitster Game</h1>
      <p className="subtitle">Guess the year and build your timeline!</p>
      
      <div className="setup-form">
        <div className="form-group">
          <label>Number of Teams:</label>
          <div className="team-selector">
            {[2, 3, 4, 5, 6].map(num => (
              <button
                key={num}
                className={numTeams === num ? 'active' : ''}
                onClick={() => handleNumTeamsChange(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Team Names:</label>
          <div className="team-names">
            {teamNames.map((name, index) => (
              <input
                key={index}
                type="text"
                value={name}
                onChange={(e) => handleTeamNameChange(index, e.target.value)}
                placeholder={`Team ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Songs to Win:</label>
          <div className="team-selector">
            {[5, 10, 15, 20].map(num => (
              <button
                key={num}
                className={winningScore === num ? 'active' : ''}
                onClick={() => setWinningScore(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <button className="start-button" onClick={handleStart}>
          Start Game
        </button>
      </div>

      <div className="rules">
        <h3>How to Play:</h3>
        <ul>
          <li>Listen to a song and guess when it was released</li>
          <li>Place it in your timeline (before, between, or after existing songs)</li>
          <li>If you're correct, the song stays in your timeline</li>
          <li>First team to reach the target number of songs wins!</li>
        </ul>
      </div>
    </div>
  );
}
