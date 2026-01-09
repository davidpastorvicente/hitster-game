import { useState } from 'react'
import GameSetup from './components/GameSetup'
import GameBoard from './components/GameBoard'
import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [teams, setTeams] = useState([])
  const [winningScore, setWinningScore] = useState(10)

  const handleStartGame = (teamNames, targetScore) => {
    setTeams(teamNames)
    setWinningScore(targetScore)
    setGameStarted(true)
  }

  return (
    <div className="app">
      {!gameStarted ? (
        <GameSetup onStartGame={handleStartGame} />
      ) : (
        <GameBoard teams={teams} winningScore={winningScore} />
      )}
    </div>
  )
}

export default App
