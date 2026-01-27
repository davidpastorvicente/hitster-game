import { useState } from 'react'
import GameSetup from './components/GameSetup'
import GameBoard from './components/GameBoard'
import LanguageSelector from './components/LanguageSelector'
import ThemeToggle from './components/ThemeToggle'
import AuthGuard from './components/AuthGuard'
import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [teams, setTeams] = useState([])
  const [winningScore, setWinningScore] = useState(10)
  const [songSet, setSongSet] = useState('everything')
  
  // Initialize language from localStorage or default to 'es'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('hitster_language') || 'es'
  })

  // Persist language preference
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
    localStorage.setItem('hitster_language', newLanguage)
  }

  const handleStartGame = (teamNames, targetScore, selectedSongSet) => {
    setTeams(teamNames)
    setWinningScore(targetScore)
    setSongSet(selectedSongSet)
    setGameStarted(true)
  }

  return (
    <AuthGuard language={language} onLanguageChange={handleLanguageChange}>
      <div className="app">
        <div className="top-controls">
          <LanguageSelector currentLanguage={language} onLanguageChange={handleLanguageChange} />
          <ThemeToggle />
        </div>
        {!gameStarted ? (
          <GameSetup onStartGame={handleStartGame} language={language} />
        ) : (
          <GameBoard teams={teams} winningScore={winningScore} language={language} songSet={songSet} />
        )}
      </div>
    </AuthGuard>
  )
}

export default App
