/**
 * Minesweeper Minimal - Board Generator
 * Spec: specs/001-minesweeper-game/SPEC.md
 * 
 * Implements the board generation algorithm with first-click safety.
 */

import { Board, CellState, Position, BOARD_SIZE, MINE_COUNT } from './types';

/**
 * Creates an empty board with all cells hidden and no mines
 */
function createEmptyBoard(): Board {
  const board: Board = [];
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    board[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      board[row][col] = {
        isMine: false,
        state: CellState.Hidden,
        adjacentMines: 0,
      };
    }
  }
  
  return board;
}

/**
 * Gets all valid neighbor positions for a given cell
 * @param position - The cell position
 * @param boardSize - The size of the board (defaults to BOARD_SIZE)
 */
function getNeighbors(position: Position, boardSize: number = BOARD_SIZE): Position[] {
  const { row, col } = position;
  const neighbors: Position[] = [];
  
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue; // Skip the cell itself
      
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
        neighbors.push({ row: newRow, col: newCol });
      }
    }
  }
  
  return neighbors;
}

/**
 * Calculates the number of adjacent mines for all cells
 */
function calculateAdjacentMines(board: Board): void {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col].isMine) continue;
      
      const neighbors = getNeighbors({ row, col });
      const mineCount = neighbors.filter(
        (pos) => board[pos.row][pos.col].isMine
      ).length;
      
      board[row][col].adjacentMines = mineCount;
    }
  }
}

/**
 * Places mines randomly on the board, avoiding the first click position and its neighbors
 * 
 * @param board - The board to place mines on
 * @param firstClick - The position of the first click (to avoid placing mines there)
 */
function placeMines(board: Board, firstClick: Position): void {
  // Get all positions to avoid (first click + its neighbors)
  const avoidPositions = [firstClick, ...getNeighbors(firstClick)];
  const avoidSet = new Set(
    avoidPositions.map((pos) => `${pos.row},${pos.col}`)
  );
  
  // Get all available positions
  const availablePositions: Position[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const key = `${row},${col}`;
      if (!avoidSet.has(key)) {
        availablePositions.push({ row, col });
      }
    }
  }
  
  // Shuffle and place mines
  for (let i = availablePositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availablePositions[i], availablePositions[j]] = [
      availablePositions[j],
      availablePositions[i],
    ];
  }
  
  // Place MINE_COUNT mines
  for (let i = 0; i < Math.min(MINE_COUNT, availablePositions.length); i++) {
    const { row, col } = availablePositions[i];
    board[row][col].isMine = true;
  }
}

/**
 * Generates a new board with mines placed randomly.
 * Uses first-click safety: the first click and its neighbors will never contain mines.
 * 
 * @param firstClick - The position of the first click
 * @returns A new board with mines placed and adjacent mine counts calculated
 */
export function generateBoard(firstClick: Position): Board {
  const board = createEmptyBoard();
  placeMines(board, firstClick);
  calculateAdjacentMines(board);
  return board;
}

/**
 * Creates an initial empty board (used before first click)
 */
export function createInitialBoard(): Board {
  return createEmptyBoard();
}

/**
 * Utility function to get neighbors (exported for use in floodFill)
 */
export { getNeighbors };
