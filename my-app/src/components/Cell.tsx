/**
 * Minesweeper Minimal - Cell Component
 * Spec: specs/001-minesweeper-game/SPEC.md
 */

import { Cell as CellType, CellState } from '../lib/types';
import styles from '../styles/Cell.module.css';

interface CellProps {
  cell: CellType;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  row: number;
  col: number;
}

export function Cell({ cell, onClick, onContextMenu, row, col }: CellProps) {
  const { state, isMine, adjacentMines } = cell;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu(e);
  };

  const getCellContent = () => {
    if (state === CellState.Flagged) {
      return '🚩';
    }
    
    if (state === CellState.Revealed) {
      if (isMine) {
        return '💣';
      }
      if (adjacentMines > 0) {
        return adjacentMines;
      }
    }
    
    return '';
  };

  const getCellClass = () => {
    const classes = [styles.cell];
    
    if (state === CellState.Revealed) {
      classes.push(styles.revealed);
      if (isMine) {
        classes.push(styles.mine);
      } else if (adjacentMines > 0) {
        classes.push(styles[`adjacent${adjacentMines}`]);
      }
    } else if (state === CellState.Flagged) {
      classes.push(styles.flagged);
    } else {
      classes.push(styles.hidden);
    }
    
    return classes.join(' ');
  };

  return (
    <button
      className={getCellClass()}
      onClick={onClick}
      onContextMenu={handleContextMenu}
      disabled={state === CellState.Revealed}
      aria-label={`Cell ${row + 1}, ${col + 1}`}
      data-testid={`cell-${row}-${col}`}
    >
      {getCellContent()}
    </button>
  );
}
