import { useState } from 'react';
import { translations } from '../translations';
import { songSetOptions } from '../data/songs';
import './GameSetup.css';

export default function GameSetup({ onStartGame, language }) {
  const [numTeams, setNumTeams] = useState(2);
  const [teamNames, setTeamNames] = useState(['Team 1', 'Team 2']);
  const [winningScore, setWinningScore] = useState(10);
  const [songSet, setSongSet] = useState('everything');

  const t = translations[language];

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
    onStartGame(teamNames, winningScore, songSet);
  };

  return (
    <div className="game-setup">
      <h1>{t.setupTitle}</h1>
      <p className="subtitle">{t.setupSubtitle}</p>
      
      <div className="setup-form">
        <div className="form-group">
          <label>{t.teamsNumber}</label>
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
          <label>{t.teamNames}</label>
          <div className="team-names">
            {teamNames.map((name, index) => (
              <input
                key={index}
                type="text"
                value={name}
                onChange={(e) => handleTeamNameChange(index, e.target.value)}
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>{t.winningScoreLabel}</label>
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

        <div className="form-group">
          <label>{t.songSetLabel || 'Song Set:'}</label>
          <div className="team-selector">
            {songSetOptions.map(option => (
              <button
                key={option.id}
                className={songSet === option.id ? 'active' : ''}
                onClick={() => setSongSet(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <button className="start-button" onClick={handleStart}>
          {t.startGameButton}
        </button>
      </div>
    </div>
  );
}
