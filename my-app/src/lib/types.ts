/**
 * Minesweeper Minimal - Type Definitions
 * Spec: specs/001-minesweeper-game/SPEC.md
 */

/**
 * Represents the state of a single cell
 */
export enum CellState {
  Hidden = 'hidden',
  Revealed = 'revealed',
  Flagged = 'flagged',
}

/**
 * Represents the overall game status
 */
export enum GameStatus {
  Ready = 'ready',      // Initial state, board not yet generated
  Playing = 'playing',  // Game in progress
  Won = 'won',          // Player won (all non-mine cells revealed)
  Lost = 'lost',        // Player hit a mine
}

/**
 * Represents a position on the board
 */
export interface Position {
  row: number;
  col: number;
}

/**
 * Represents a single cell in the game board
 */
export interface Cell {
  /** Whether this cell contains a mine */
  isMine: boolean;
  
  /** Current state of the cell */
  state: CellState;
  
  /** Number of adjacent mines (0-8) */
  adjacentMines: number;
}

/**
 * Represents the entire game board (9x9 grid)
 */
export type Board = Cell[][];

/**
 * Represents the complete game state
 */
export interface GameState {
  /** The game board */
  board: Board;
  
  /** Current game status */
  status: GameStatus;
  
  /** Number of flags remaining (starts at 10) */
  flagsRemaining: number;
  
  /** Elapsed time in seconds */
  elapsedTime: number;
  
  /** Whether the first click has been made */
  firstClick: boolean;
}

/**
 * Constants for the game
 */
export const BOARD_SIZE = 9;
export const MINE_COUNT = 10;
