/**
 * Minesweeper Minimal - Game State Hook
 * Spec: specs/001-minesweeper-game/SPEC.md
 * 
 * Custom React hook that manages the complete game state and logic.
 */

import { useState, useEffect, useCallback } from 'react';
import { GameState, GameStatus, CellState, Position, BOARD_SIZE, MINE_COUNT } from '../lib/types';
import { generateBoard, createInitialBoard } from '../lib/generator';
import { floodFill } from '../lib/floodFill';

/**
 * Creates the initial game state
 */
function createInitialState(): GameState {
  return {
    board: createInitialBoard(),
    status: GameStatus.Ready,
    flagsRemaining: MINE_COUNT,
    elapsedTime: 0,
    firstClick: true,
  };
}

/**
 * Checks if the player has won the game
 * Win condition: all non-mine cells are revealed
 */
function checkWinCondition(state: GameState): boolean {
  if (state.status !== GameStatus.Playing) return false;
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = state.board[row][col];
      // If any non-mine cell is not revealed, game is not won
      if (!cell.isMine && cell.state !== CellState.Revealed) {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Custom hook for Minesweeper game logic
 */
export function useMinesweeper() {
  const [gameState, setGameState] = useState<GameState>(createInitialState());

  /**
   * Timer effect - increments elapsed time every second while playing
   */
  useEffect(() => {
    if (gameState.status !== GameStatus.Playing) return;

    const timer = setInterval(() => {
      setGameState((prev) => ({
        ...prev,
        elapsedTime: prev.elapsedTime + 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.status]);

  /**
   * Reveals a cell at the given position
   */
  const revealCell = useCallback((position: Position) => {
    setGameState((prev) => {
      // Can't reveal if game is over or cell is flagged
      if (prev.status === GameStatus.Won || prev.status === GameStatus.Lost) {
        return prev;
      }

      const cell = prev.board[position.row][position.col];
      if (cell.state === CellState.Flagged || cell.state === CellState.Revealed) {
        return prev;
      }

      // Clone the board for immutability
      const newBoard = prev.board.map((row) =>
        row.map((cell) => ({ ...cell }))
      );

      let newStatus = prev.status;
      let firstClick = prev.firstClick;

      // First click: generate the board
      if (firstClick) {
        const generatedBoard = generateBoard(position);
        // Copy generated board to newBoard
        for (let row = 0; row < BOARD_SIZE; row++) {
          for (let col = 0; col < BOARD_SIZE; col++) {
            newBoard[row][col] = { ...generatedBoard[row][col] };
          }
        }
        newStatus = GameStatus.Playing;
        firstClick = false;
      }

      const targetCell = newBoard[position.row][position.col];

      // Check if hit a mine
      if (targetCell.isMine) {
        // Reveal all mines
        for (let row = 0; row < BOARD_SIZE; row++) {
          for (let col = 0; col < BOARD_SIZE; col++) {
            if (newBoard[row][col].isMine) {
              newBoard[row][col].state = CellState.Revealed;
            }
          }
        }
        return {
          ...prev,
          board: newBoard,
          status: GameStatus.Lost,
          firstClick,
        };
      }

      // Reveal the cell using flood fill
      floodFill(newBoard, position);

      // Check win condition
      const newState = {
        ...prev,
        board: newBoard,
        status: newStatus,
        firstClick,
      };

      if (checkWinCondition(newState)) {
        return { ...newState, status: GameStatus.Won };
      }

      return newState;
    });
  }, []);

  /**
   * Toggles flag on a cell
   */
  const toggleFlag = useCallback((position: Position) => {
    setGameState((prev) => {
      // Can't flag if game is over
      if (prev.status === GameStatus.Won || prev.status === GameStatus.Lost) {
        return prev;
      }

      const cell = prev.board[position.row][position.col];
      
      // Can't flag revealed cells
      if (cell.state === CellState.Revealed) {
        return prev;
      }

      // Clone the board
      const newBoard = prev.board.map((row) =>
        row.map((cell) => ({ ...cell }))
      );

      const targetCell = newBoard[position.row][position.col];
      let newFlagsRemaining = prev.flagsRemaining;

      if (targetCell.state === CellState.Flagged) {
        // Remove flag
        targetCell.state = CellState.Hidden;
        newFlagsRemaining++;
      } else if (targetCell.state === CellState.Hidden && prev.flagsRemaining > 0) {
        // Add flag
        targetCell.state = CellState.Flagged;
        newFlagsRemaining--;
      }

      return {
        ...prev,
        board: newBoard,
        flagsRemaining: newFlagsRemaining,
      };
    });
  }, []);

  /**
   * Resets the game to initial state
   */
  const resetGame = useCallback(() => {
    setGameState(createInitialState());
  }, []);

  return {
    board: gameState.board,
    status: gameState.status,
    flagsRemaining: gameState.flagsRemaining,
    elapsedTime: gameState.elapsedTime,
    revealCell,
    toggleFlag,
    resetGame,
  };
}
