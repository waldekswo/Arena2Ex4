/**
 * Minesweeper Minimal - Flood Fill Algorithm
 * Spec: specs/001-minesweeper-game/SPEC.md
 * 
 * Implements iterative BFS flood fill to reveal empty cells and their neighbors.
 */

import { Board, CellState, Position } from './types';

/**
 * Gets all valid neighbor positions for a given cell
 * @param position - The cell position
 * @param board - The game board
 */
function getNeighborsForBoard(position: Position, board: Board): Position[] {
  const { row, col } = position;
  const boardSize = board.length;
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
 * Performs flood fill using iterative BFS to reveal empty cells.
 * When a cell with 0 adjacent mines is revealed, all its neighbors are also revealed.
 * This continues recursively until cells with adjacent mines are reached.
 * 
 * Algorithm:
 * 1. Start with the initial position in a queue
 * 2. While queue is not empty:
 *    - Dequeue a position
 *    - If cell is already revealed or flagged, skip it
 *    - Reveal the cell
 *    - If cell has 0 adjacent mines, add all hidden neighbors to queue
 * 
 * @param board - The game board (will be mutated)
 * @param start - The starting position for flood fill
 */
export function floodFill(board: Board, start: Position): void {
  const queue: Position[] = [start];
  const visited = new Set<string>();
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    const key = `${current.row},${current.col}`;
    
    // Skip if already visited
    if (visited.has(key)) continue;
    visited.add(key);
    
    const cell = board[current.row][current.col];
    
    // Skip if already revealed or flagged
    if (cell.state === CellState.Revealed || cell.state === CellState.Flagged) {
      continue;
    }
    
    // Reveal the cell
    cell.state = CellState.Revealed;
    
    // If cell has 0 adjacent mines, add all hidden neighbors to queue
    if (cell.adjacentMines === 0 && !cell.isMine) {
      const neighbors = getNeighborsForBoard(current, board);
      for (const neighbor of neighbors) {
        const neighborCell = board[neighbor.row][neighbor.col];
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        
        if (
          !visited.has(neighborKey) &&
          neighborCell.state === CellState.Hidden
        ) {
          queue.push(neighbor);
        }
      }
    }
  }
}
