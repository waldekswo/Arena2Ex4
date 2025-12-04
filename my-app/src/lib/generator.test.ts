/**
 * Unit tests for board generator
 */

import { describe, it, expect } from 'vitest';
import { generateBoard, createInitialBoard } from './generator';
import { BOARD_SIZE, MINE_COUNT, CellState } from './types';

describe('generator', () => {
  describe('createInitialBoard', () => {
    it('creates a 9x9 board', () => {
      const board = createInitialBoard();
      expect(board).toHaveLength(BOARD_SIZE);
      expect(board[0]).toHaveLength(BOARD_SIZE);
    });

    it('creates all cells as hidden with no mines', () => {
      const board = createInitialBoard();
      
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          const cell = board[row][col];
          expect(cell.isMine).toBe(false);
          expect(cell.state).toBe(CellState.Hidden);
          expect(cell.adjacentMines).toBe(0);
        }
      }
    });
  });

  describe('generateBoard', () => {
    it('creates a 9x9 board', () => {
      const board = generateBoard({ row: 4, col: 4 });
      expect(board).toHaveLength(BOARD_SIZE);
      expect(board[0]).toHaveLength(BOARD_SIZE);
    });

    it('places exactly 10 mines', () => {
      const board = generateBoard({ row: 4, col: 4 });
      
      let mineCount = 0;
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          if (board[row][col].isMine) {
            mineCount++;
          }
        }
      }
      
      expect(mineCount).toBe(MINE_COUNT);
    });

    it('does not place mine at first click position', () => {
      const firstClick = { row: 4, col: 4 };
      const board = generateBoard(firstClick);
      
      expect(board[firstClick.row][firstClick.col].isMine).toBe(false);
    });

    it('does not place mines adjacent to first click', () => {
      const firstClick = { row: 4, col: 4 };
      const board = generateBoard(firstClick);
      
      // Check all 8 neighbors
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const row = firstClick.row + dr;
          const col = firstClick.col + dc;
          
          if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
            expect(board[row][col].isMine).toBe(false);
          }
        }
      }
    });

    it('calculates adjacent mine counts correctly', () => {
      const board = generateBoard({ row: 4, col: 4 });
      
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          const cell = board[row][col];
          
          if (cell.isMine) {
            expect(cell.adjacentMines).toBe(0);
            continue;
          }
          
          // Count actual adjacent mines
          let actualCount = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              
              const newRow = row + dr;
              const newCol = col + dc;
              
              if (
                newRow >= 0 &&
                newRow < BOARD_SIZE &&
                newCol >= 0 &&
                newCol < BOARD_SIZE &&
                board[newRow][newCol].isMine
              ) {
                actualCount++;
              }
            }
          }
          
          expect(cell.adjacentMines).toBe(actualCount);
        }
      }
    });

    it('generates different boards for different first clicks', () => {
      const board1 = generateBoard({ row: 0, col: 0 });
      const board2 = generateBoard({ row: 8, col: 8 });
      
      // Boards should likely be different (very high probability)
      let differences = 0;
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          if (board1[row][col].isMine !== board2[row][col].isMine) {
            differences++;
          }
        }
      }
      
      expect(differences).toBeGreaterThan(0);
    });
  });
});
