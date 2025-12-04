/**
 * Minesweeper Minimal - Board Component
 * Spec: specs/001-minesweeper-game/SPEC.md
 */

import { Board as BoardType, Position } from '../lib/types';
import { Cell } from './Cell';
import styles from '../styles/Board.module.css';

interface BoardProps {
  board: BoardType;
  onCellClick: (position: Position) => void;
  onCellRightClick: (position: Position) => void;
}

export function Board({ board, onCellClick, onCellRightClick }: BoardProps) {
  return (
    <div className={styles.board} role="grid" aria-label="Minesweeper board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row} role="row">
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              row={rowIndex}
              col={colIndex}
              onClick={() => onCellClick({ row: rowIndex, col: colIndex })}
              onContextMenu={() => onCellRightClick({ row: rowIndex, col: colIndex })}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
