import { useState } from 'react'
import GameSetup from './components/GameSetup'
import GameBoard from './components/GameBoard'
import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [teams, setTeams] = useState([])

  const handleStartGame = (teamNames) => {
    setTeams(teamNames)
    setGameStarted(true)
  }

  return (
    <div className="app">
      {!gameStarted ? (
        <GameSetup onStartGame={handleStartGame} />
      ) : (
        <GameBoard teams={teams} />
      )}
    </div>
  )
}

export default App
