/**
 * Unit tests for flood fill algorithm
 */

import { describe, it, expect } from 'vitest';
import { floodFill } from './floodFill';
import { Board, CellState } from './types';

describe('floodFill', () => {
  it('reveals a single cell with adjacent mines', () => {
    // Create a simple 3x3 board with mine at [0,0]
    const board: Board = [
      [
        { isMine: true, state: CellState.Hidden, adjacentMines: 0 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 1 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
      ],
      [
        { isMine: false, state: CellState.Hidden, adjacentMines: 1 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 1 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
      ],
      [
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
      ],
    ];

    floodFill(board, { row: 0, col: 1 });

    expect(board[0][1].state).toBe(CellState.Revealed);
    // Cells with adjacent mines should not trigger flood fill
    expect(board[1][1].state).toBe(CellState.Hidden);
  });

  it('reveals all connected empty cells', () => {
    // Create a 3x3 board with no mines
    const board: Board = [
      [
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
      ],
      [
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
      ],
      [
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
      ],
    ];

    floodFill(board, { row: 1, col: 1 });

    // All cells should be revealed
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        expect(board[row][col].state).toBe(CellState.Revealed);
      }
    }
  });

  it('stops at cells with adjacent mines', () => {
    // Create a board where empty area is surrounded by numbered cells
    const board: Board = [
      [
        { isMine: true, state: CellState.Hidden, adjacentMines: 0 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 1 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
      ],
      [
        { isMine: false, state: CellState.Hidden, adjacentMines: 1 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 1 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
      ],
      [
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
      ],
    ];

    floodFill(board, { row: 2, col: 2 });

    // Bottom-right 3 cells should be revealed
    expect(board[2][2].state).toBe(CellState.Revealed);
    expect(board[2][1].state).toBe(CellState.Revealed);
    expect(board[2][0].state).toBe(CellState.Revealed);

    // Cells with adjacent mines should be revealed but not propagate
    expect(board[1][2].state).toBe(CellState.Revealed);
    expect(board[1][1].state).toBe(CellState.Revealed);
    expect(board[1][0].state).toBe(CellState.Revealed);
    expect(board[0][1].state).toBe(CellState.Revealed);

    // Mine should not be revealed
    expect(board[0][0].state).toBe(CellState.Hidden);
  });

  it('does not reveal flagged cells', () => {
    const board: Board = [
      [
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
        { isMine: false, state: CellState.Flagged, adjacentMines: 0 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
      ],
      [
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
      ],
      [
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
      ],
    ];

    floodFill(board, { row: 0, col: 0 });

    // Flagged cell should remain flagged
    expect(board[0][1].state).toBe(CellState.Flagged);

    // Other cells should be revealed
    expect(board[0][0].state).toBe(CellState.Revealed);
    expect(board[1][0].state).toBe(CellState.Revealed);
  });

  it('does not crash on already revealed cells', () => {
    const board: Board = [
      [
        { isMine: false, state: CellState.Revealed, adjacentMines: 0 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
      ],
      [
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
        { isMine: false, state: CellState.Hidden, adjacentMines: 0 },
      ],
    ];

    // Should not cause any issues when starting from already revealed cell
    floodFill(board, { row: 0, col: 0 });
    
    expect(board[0][0].state).toBe(CellState.Revealed);
    // Neighbors should NOT be revealed since we started from already revealed cell
    expect(board[0][1].state).toBe(CellState.Hidden);
  });
});
