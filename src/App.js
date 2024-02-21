import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import GameBoard from "./GameBoard";
import GameSetupMenu from "./GameSetupMenu";
import GameLobby from "./GameLobby";

function App() {
  const initialGameSettings = {
    isGameSetupSet: false,
    player1: { name: 'Player 1', color: '#0065f3' },
    player2: { name: 'Player 2', color: '#ff3333' },
    numRows: 6,
    numCols: 7,
    isComputer: false
  };

  const [activeView, setActiveView] = useState('lobby');
  const [gameSettings, setGameSettings] = useState(initialGameSettings);
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(error => {
        console.log('Auto-play was prevented by the browser.');
        setIsPlaying(false);
      });
    }
  }, [isPlaying]);

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleStartGame = (settings) => {
    setGameSettings({ ...gameSettings, ...settings, isGameSetupSet: true });
    setActiveView('gameBoard');
  };

  const handleEndGame = () => {
    setGameSettings(initialGameSettings);
    setActiveView('gameSetup');
  };
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  return (
      <div className={`App ${theme}`}>
        <header className="App-header">
          <audio ref={audioRef} src="/dreams.mp3" loop/>
          <button className="audio-button" onClick={togglePlay}>
            {isPlaying ? '🔈' : '🔉'}
          </button>
          <span className="gameTitle" onClick={() => handleViewChange('lobby')}>Four in a Row</span>
          <button className="theme-button" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {activeView === 'lobby' && <GameLobby onGoToSetup={() => handleViewChange('gameSetup')}/>}
          {activeView === 'gameSetup' && (
              <GameSetupMenu onStartGame={handleStartGame} defaultValues={gameSettings}/>
          )}
          {activeView === 'gameBoard' && (
              <GameBoard {...gameSettings} onEndGame={handleEndGame}/>
          )}
        </header>
      </div>
  );
}

export default App;
