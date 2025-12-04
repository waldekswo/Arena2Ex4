/**
 * Minesweeper Minimal - HUD (Heads-Up Display) Component
 * Spec: specs/001-minesweeper-game/SPEC.md
 */

import { GameStatus } from '../lib/types';
import styles from '../styles/Hud.module.css';

interface HudProps {
  flagsRemaining: number;
  elapsedTime: number;
  status: GameStatus;
  onReset: () => void;
}

export function Hud({ flagsRemaining, elapsedTime, status, onReset }: HudProps) {
  const formatTime = (seconds: number): string => {
    return seconds.toString().padStart(3, '0');
  };

  const getStatusEmoji = () => {
    switch (status) {
      case GameStatus.Won:
        return '😎';
      case GameStatus.Lost:
        return '😵';
      case GameStatus.Playing:
        return '😊';
      default:
        return '🙂';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case GameStatus.Won:
        return 'You Won!';
      case GameStatus.Lost:
        return 'Game Over';
      case GameStatus.Playing:
        return 'Playing';
      default:
        return 'Ready';
    }
  };

  return (
    <div className={styles.hud}>
      <div className={styles.counter} aria-label="Flags remaining">
        🚩 {flagsRemaining.toString().padStart(2, '0')}
      </div>
      
      <button
        className={styles.resetButton}
        onClick={onReset}
        aria-label="Reset game"
        title="Reset game"
      >
        {getStatusEmoji()}
      </button>
      
      <div className={styles.timer} aria-label="Elapsed time">
        ⏱️ {formatTime(elapsedTime)}
      </div>
      
      <div className={styles.status} aria-live="polite">
        {getStatusText()}
      </div>
    </div>
  );
}
