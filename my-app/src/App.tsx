/**
 * Minesweeper Minimal - Main App Component
 * Spec: specs/001-minesweeper-game/SPEC.md
 */

import { useMinesweeper } from './hooks/useMinesweeper';
import { Board } from './components/Board';
import { Hud } from './components/Hud';
import './App.css';

function App() {
  const {
    board,
    status,
    flagsRemaining,
    elapsedTime,
    revealCell,
    toggleFlag,
    resetGame,
  } = useMinesweeper();

  return (
    <div className="app">
      <h1>Minesweeper Minimal</h1>
      <Hud
        flagsRemaining={flagsRemaining}
        elapsedTime={elapsedTime}
        status={status}
        onReset={resetGame}
      />
      <Board
        board={board}
        onCellClick={revealCell}
        onCellRightClick={toggleFlag}
      />
      <footer className="instructions">
        <p>Left click to reveal • Right click to flag</p>
      </footer>
    </div>
  );
}

export default App;
