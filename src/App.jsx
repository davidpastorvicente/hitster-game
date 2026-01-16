import { useState } from 'react'
import GameSetup from './components/GameSetup'
import GameBoard from './components/GameBoard'
import LanguageSelector from './components/LanguageSelector'
import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [teams, setTeams] = useState([])
  const [winningScore, setWinningScore] = useState(10)
  const [language, setLanguage] = useState('es')

  const handleStartGame = (teamNames, targetScore) => {
    setTeams(teamNames)
    setWinningScore(targetScore)
    setGameStarted(true)
  }

  return (
    <div className="app">
      <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
      {!gameStarted ? (
        <GameSetup onStartGame={handleStartGame} language={language} />
      ) : (
        <GameBoard teams={teams} winningScore={winningScore} language={language} />
      )}
    </div>
  )
}

export default App
