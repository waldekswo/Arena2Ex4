# Implementation Plan: Minesweeper Minimal Game

**Feature**: Minesweeper Minimal Game  
**Feature Branch**: `001-minesweeper-game`  
**Created**: 2025-12-03  
**Status**: Planning  
**Estimated Effort**: 16-20 hours  
**Target Completion**: MVP ready for deployment

---

## Plan Overview

This plan breaks down the implementation of Minesweeper Minimal into discrete, testable phases. Each phase builds upon the previous one, allowing for incremental development and testing.

**Key Principles**:
- Start with core logic before UI
- Test each module before moving to next
- Keep components simple and focused
- Deploy early, deploy often

---

## Phase 1: Project Setup & Configuration (2-3 hours)

### Objectives
- Convert existing Create React App to Vite + TypeScript
- Set up development environment
- Configure testing infrastructure
- Establish code quality tools

### Tasks

#### 1.1 Vite Migration
**Current state**: Project uses Create React App  
**Target state**: Vite-based project with TypeScript

**Steps**:
1. Create new Vite project structure in parallel
2. Copy existing `src/` files to new structure
3. Install Vite dependencies
4. Configure `vite.config.ts` with base path for GitHub Pages
5. Update `package.json` scripts
6. Test build process

**Files to create/modify**:
- `vite.config.ts` - Vite configuration with test setup
- `tsconfig.json` - TypeScript strict mode configuration
- `tsconfig.node.json` - Node-specific TS config
- `index.html` - Move to root (Vite convention)
- `package.json` - Update scripts and dependencies

**Acceptance criteria**:
- [ ] `npm run dev` starts development server
- [ ] `npm run build` creates production build in `dist/`
- [ ] `npm run preview` serves production build locally
- [ ] TypeScript strict mode enabled, no errors
- [ ] Base path `/Arena2Ex4/` configured for GitHub Pages

#### 1.2 Testing Infrastructure
**Dependencies to install**:
```bash
npm install -D vitest @vitest/ui jsdom
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Files to create**:
- `src/setupTests.ts` - Test environment setup
- `vitest.config.ts` or configure in `vite.config.ts`

**Acceptance criteria**:
- [ ] `npm test` runs Vitest in watch mode
- [ ] `npm test -- --run` runs tests once (for CI)
- [ ] Testing utilities available globally

#### 1.3 Code Quality Tools
**Dependencies to install**:
```bash
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D prettier eslint-config-prettier
```

**Files to create**:
- `.eslintrc.json` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `.prettierignore` - Ignore dist, node_modules

**Acceptance criteria**:
- [ ] `npm run lint` checks for errors
- [ ] `npm run format` formats code
- [ ] No ESLint errors in existing code

#### 1.4 Directory Structure Setup
**Create directories**:
```
src/
├── components/     # React components
├── hooks/          # Custom hooks
├── lib/            # Pure functions, utilities
└── styles/         # CSS Modules
```

**Acceptance criteria**:
- [ ] All directories exist
- [ ] Each has a `.gitkeep` or initial file

---

## Phase 2: Core Game Logic (4-5 hours)

### Objectives
- Implement data types
- Build mine generation algorithm
- Build flood-fill algorithm
- Create game state management hook

**Note**: This phase is entirely testable without UI

### Tasks

#### 2.1 Type Definitions
**File**: `src/lib/types.ts`

**Types to define**:
```typescript
export type CellState = 'covered' | 'revealed' | 'flagged';
export type GameStatus = 'idle' | 'running' | 'won' | 'lost';

export interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  adjacentMines: number;
  state: CellState;
}

export type Board = Cell[][];

export interface GameState {
  board: Board;
  status: GameStatus;
  mineCount: number;
  flagCount: number;
  revealedCount: number;
  startTime: number | null;
  elapsedTime: number;
}

export interface Position {
  row: number;
  col: number;
}
```

**Acceptance criteria**:
- [ ] All types compile without errors
- [ ] Types used consistently across project

#### 2.2 Board Generator
**File**: `src/lib/generator.ts`

**Function signature**:
```typescript
export function generateBoard(
  rows: number,
  cols: number,
  mineCount: number,
  firstClick: Position
): Board
```

**Algorithm**:
1. Create empty grid
2. Get all positions EXCEPT firstClick and its 8 neighbors
3. Randomly select `mineCount` positions for mines
4. Calculate adjacentMines for each cell
5. Return board

**Test file**: `src/lib/generator.test.ts`

**Test cases**:
```typescript
describe('generateBoard', () => {
  it('creates board with correct dimensions', () => {
    const board = generateBoard(9, 9, 10, { row: 0, col: 0 });
    expect(board.length).toBe(9);
    expect(board[0].length).toBe(9);
  });

  it('places exactly the specified number of mines', () => {
    const board = generateBoard(9, 9, 10, { row: 4, col: 4 });
    const mineCount = board.flat().filter(cell => cell.isMine).length;
    expect(mineCount).toBe(10);
  });

  it('never places mine at first click position', () => {
    const firstClick = { row: 4, col: 4 };
    const board = generateBoard(9, 9, 10, firstClick);
    expect(board[4][4].isMine).toBe(false);
  });

  it('never places mine adjacent to first click', () => {
    const firstClick = { row: 4, col: 4 };
    const board = generateBoard(9, 9, 10, firstClick);
    
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const r = firstClick.row + dr;
        const c = firstClick.col + dc;
        if (r >= 0 && r < 9 && c >= 0 && c < 9) {
          expect(board[r][c].isMine).toBe(false);
        }
      }
    }
  });

  it('calculates adjacentMines correctly', () => {
    // Create board with known mine positions
    const board = generateBoard(9, 9, 1, { row: 0, col: 0 });
    // Find the mine
    let minePos: Position | null = null;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c].isMine) {
          minePos = { row: r, col: c };
          break;
        }
      }
      if (minePos) break;
    }
    
    // Check neighbors of mine have adjacentMines >= 1
    if (minePos) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const r = minePos.row + dr;
          const c = minePos.col + dc;
          if (r >= 0 && r < 9 && c >= 0 && c < 9) {
            expect(board[r][c].adjacentMines).toBeGreaterThanOrEqual(1);
          }
        }
      }
    }
  });
});
```

**Acceptance criteria**:
- [ ] All tests pass
- [ ] Function handles edge cases (corners, edges)
- [ ] No runtime errors

#### 2.3 Flood Fill Algorithm
**File**: `src/lib/floodFill.ts`

**Function signature**:
```typescript
export function floodFill(
  board: Board,
  startRow: number,
  startCol: number
): Position[]
```

**Algorithm** (Iterative BFS):
```typescript
export function floodFill(board: Board, startRow: number, startCol: number): Position[] {
  const result: Position[] = [];
  const visited = new Set<string>();
  const queue: Position[] = [{ row: startRow, col: startCol }];
  
  const rows = board.length;
  const cols = board[0].length;
  
  while (queue.length > 0) {
    const pos = queue.shift()!;
    const key = `${pos.row},${pos.col}`;
    
    if (visited.has(key)) continue;
    if (pos.row < 0 || pos.row >= rows || pos.col < 0 || pos.col >= cols) continue;
    
    const cell = board[pos.row][pos.col];
    if (cell.isMine || cell.state === 'revealed') continue;
    
    visited.add(key);
    result.push(pos);
    
    // If cell has adjacent mines, don't add neighbors (stop condition)
    if (cell.adjacentMines > 0) continue;
    
    // Add all 8 neighbors
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        queue.push({ row: pos.row + dr, col: pos.col + dc });
      }
    }
  }
  
  return result;
}
```

**Test file**: `src/lib/floodFill.test.ts`

**Test cases**:
```typescript
describe('floodFill', () => {
  it('reveals single empty cell with numbered neighbors', () => {
    // Create test board with single empty cell surrounded by numbered cells
    // ...test implementation
  });

  it('reveals large connected empty area', () => {
    // Create test board with large empty area
    // ...test implementation
  });

  it('stops at numbered cells (does not reveal beyond)', () => {
    // Verify numbered cells are revealed but their neighbors are not
    // ...test implementation
  });

  it('handles corner cases', () => {
    // Test flood fill starting from corner
    // ...test implementation
  });

  it('returns no duplicates', () => {
    // Verify each position appears only once
    // ...test implementation
  });
});
```

**Acceptance criteria**:
- [ ] All tests pass
- [ ] No stack overflow on large areas
- [ ] Correctly stops at numbered cells
- [ ] No duplicate positions in result

#### 2.4 Game State Hook
**File**: `src/hooks/useMinesweeper.ts`

**Hook signature**:
```typescript
export interface UseMinesweeperReturn {
  gameState: GameState;
  revealCell: (row: number, col: number) => void;
  toggleFlag: (row: number, col: number) => void;
  resetGame: () => void;
}

export function useMinesweeper(
  rows: number,
  cols: number,
  mineCount: number
): UseMinesweeperReturn
```

**Implementation outline**:
```typescript
export function useMinesweeper(rows: number, cols: number, mineCount: number) {
  const [gameState, setGameState] = useState<GameState>(/* initial state */);
  
  const revealCell = useCallback((row: number, col: number) => {
    setGameState(prev => {
      // If first click, generate board
      if (prev.status === 'idle') {
        const newBoard = generateBoard(rows, cols, mineCount, { row, col });
        // Reveal first cell and start timer
        // ...
      }
      
      // If cell is flagged or revealed, ignore
      // If cell is mine, game over
      // If cell is empty, flood fill
      // Check win condition
      // ...
    });
  }, [rows, cols, mineCount]);
  
  const toggleFlag = useCallback((row: number, col: number) => {
    // Toggle flag on/off
    // Update flag count
    // ...
  }, []);
  
  const resetGame = useCallback(() => {
    // Reset to initial state
    // ...
  }, [rows, cols]);
  
  // Timer effect
  useEffect(() => {
    if (gameState.status !== 'running') return;
    
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        elapsedTime: Math.floor((Date.now() - prev.startTime!) / 1000)
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [gameState.status, gameState.startTime]);
  
  return { gameState, revealCell, toggleFlag, resetGame };
}
```

**Test file**: `src/hooks/useMinesweeper.test.ts`

**Test cases**:
```typescript
describe('useMinesweeper', () => {
  it('starts in idle state', () => {
    const { result } = renderHook(() => useMinesweeper(9, 9, 10));
    expect(result.current.gameState.status).toBe('idle');
  });

  it('transitions to running on first reveal', () => {
    const { result } = renderHook(() => useMinesweeper(9, 9, 10));
    act(() => {
      result.current.revealCell(4, 4);
    });
    expect(result.current.gameState.status).toBe('running');
  });

  it('first click never reveals a mine', () => {
    // Test multiple times to ensure randomness doesn't cause mine
    // ...
  });

  it('transitions to lost when mine revealed', () => {
    // Set up board with known mine position
    // Reveal mine
    // Check status is 'lost'
    // ...
  });

  it('transitions to won when all safe cells revealed', () => {
    // Reveal all non-mine cells
    // Check status is 'won'
    // ...
  });

  it('updates flag count correctly', () => {
    const { result } = renderHook(() => useMinesweeper(9, 9, 10));
    act(() => {
      result.current.revealCell(4, 4); // Start game
    });
    act(() => {
      result.current.toggleFlag(0, 0);
    });
    expect(result.current.gameState.flagCount).toBe(1);
  });

  it('timer starts on first reveal', async () => {
    const { result } = renderHook(() => useMinesweeper(9, 9, 10));
    act(() => {
      result.current.revealCell(4, 4);
    });
    expect(result.current.gameState.startTime).not.toBeNull();
    
    await waitFor(() => {
      expect(result.current.gameState.elapsedTime).toBeGreaterThan(0);
    }, { timeout: 2000 });
  });
});
```

**Acceptance criteria**:
- [ ] All tests pass
- [ ] Hook properly manages game state
- [ ] Timer works correctly
- [ ] Win/lose conditions detected
- [ ] No memory leaks (cleanup effects)

---

## Phase 3: UI Components (3-4 hours)

### Objectives
- Build presentational components
- Implement event handlers
- Add basic styling

### Tasks

#### 3.1 Cell Component
**File**: `src/components/Cell.tsx`

**Props interface**:
```typescript
interface CellProps {
  cell: Cell;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
  disabled: boolean;
  focused: boolean;
}
```

**Implementation**:
```typescript
export const Cell = memo(({ cell, onReveal, onFlag, disabled, focused }: CellProps) => {
  const [longPressTimer, setLongPressTimer] = useState<number | null>(null);
  
  const handleClick = () => {
    if (!disabled) onReveal(cell.row, cell.col);
  };
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled) onFlag(cell.row, cell.col);
  };
  
  const handleTouchStart = () => {
    const timer = window.setTimeout(() => {
      if (!disabled) onFlag(cell.row, cell.col);
    }, 300);
    setLongPressTimer(timer);
  };
  
  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };
  
  const getAriaLabel = (): string => {
    // Generate aria-label based on cell state
    // ...
  };
  
  const getCellContent = (): string => {
    if (cell.state === 'flagged') return '🚩';
    if (cell.state !== 'revealed') return '';
    if (cell.isMine) return '💣';
    if (cell.adjacentMines > 0) return String(cell.adjacentMines);
    return '';
  };
  
  return (
    <div
      role="gridcell"
      aria-label={getAriaLabel()}
      className={`cell ${cell.state} ${focused ? 'focused' : ''} n${cell.adjacentMines}`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {getCellContent()}
    </div>
  );
});
```

**Style file**: `src/styles/Cell.module.css`

**Acceptance criteria**:
- [ ] Cell renders correctly for all states
- [ ] Click triggers reveal
- [ ] Right-click/long-press triggers flag
- [ ] Context menu prevented
- [ ] Memoized (doesn't re-render unnecessarily)

#### 3.2 Board Component
**File**: `src/components/Board.tsx`

**Props interface**:
```typescript
interface BoardProps {
  board: Board;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
  disabled: boolean;
}
```

**Implementation**:
```typescript
export function Board({ board, onReveal, onFlag, disabled }: BoardProps) {
  const [focusedCell, setFocusedCell] = useState<Position>({ row: 0, col: 0 });
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        setFocusedCell(prev => ({
          ...prev,
          row: Math.max(0, prev.row - 1)
        }));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedCell(prev => ({
          ...prev,
          row: Math.min(board.length - 1, prev.row + 1)
        }));
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setFocusedCell(prev => ({
          ...prev,
          col: Math.max(0, prev.col - 1)
        }));
        break;
      case 'ArrowRight':
        e.preventDefault();
        setFocusedCell(prev => ({
          ...prev,
          col: Math.min(board[0].length - 1, prev.col + 1)
        }));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onReveal(focusedCell.row, focusedCell.col);
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        onFlag(focusedCell.row, focusedCell.col);
        break;
    }
  };
  
  return (
    <div
      role="grid"
      className="board"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              onReveal={onReveal}
              onFlag={onFlag}
              disabled={disabled}
              focused={
                focusedCell.row === rowIndex &&
                focusedCell.col === colIndex
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
```

**Style file**: `src/styles/Board.module.css`

**Acceptance criteria**:
- [ ] Renders 81 cells in 9×9 grid
- [ ] Keyboard navigation works
- [ ] Focus visible on focused cell
- [ ] Grid is responsive

#### 3.3 HUD Component
**File**: `src/components/Hud.tsx`

**Props interface**:
```typescript
interface HudProps {
  mineCount: number;
  flagCount: number;
  elapsedTime: number;
  onReset: () => void;
  gameStatus: GameStatus;
}
```

**Implementation**:
```typescript
export function Hud({ mineCount, flagCount, elapsedTime, onReset, gameStatus }: HudProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const remainingMines = mineCount - flagCount;
  
  return (
    <div className="hud">
      <div className="mine-counter">
        <span>💣</span>
        <span>{remainingMines}</span>
      </div>
      
      <button
        className="reset-button"
        onClick={onReset}
        aria-label="Reset game"
      >
        🔄
      </button>
      
      <div className="timer">
        <span>⏱️</span>
        <span>{formatTime(elapsedTime)}</span>
      </div>
      
      {gameStatus === 'won' && (
        <div className="game-message win">YOU WIN! 🎉</div>
      )}
      {gameStatus === 'lost' && (
        <div className="game-message lose">GAME OVER! 💥</div>
      )}
    </div>
  );
}
```

**Style file**: `src/styles/Hud.module.css`

**Acceptance criteria**:
- [ ] Mine counter displays correctly (can be negative)
- [ ] Timer formats as MM:SS
- [ ] Reset button works
- [ ] Win/lose messages display

#### 3.4 App Component
**File**: `src/App.tsx`

**Implementation**:
```typescript
export function App() {
  const { gameState, revealCell, toggleFlag, resetGame } = useMinesweeper(9, 9, 10);
  
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        resetGame();
      }
    };
    
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [resetGame]);
  
  return (
    <div className="app">
      <h1>Minesweeper Minimal</h1>
      
      <Hud
        mineCount={gameState.mineCount}
        flagCount={gameState.flagCount}
        elapsedTime={gameState.elapsedTime}
        onReset={resetGame}
        gameStatus={gameState.status}
      />
      
      <Board
        board={gameState.board}
        onReveal={revealCell}
        onFlag={toggleFlag}
        disabled={gameState.status === 'won' || gameState.status === 'lost'}
      />
    </div>
  );
}
```

**Style file**: `src/styles/App.module.css`

**Acceptance criteria**:
- [ ] App renders without errors
- [ ] All components connected properly
- [ ] Global R key triggers reset
- [ ] Game is playable

---

## Phase 4: Styling & Responsiveness (2-3 hours)

### Objectives
- Create visual design
- Ensure mobile responsiveness
- Add accessibility features (focus rings, contrast)

### Tasks

#### 4.1 Cell Styling
**File**: `src/styles/Cell.module.css`

**Key styles**:
```css
.cell {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  border: 1px solid #999;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.cell.covered {
  background: #c0c0c0;
  background: linear-gradient(135deg, #d4d4d4 0%, #b0b0b0 100%);
}

.cell.covered:hover:not(.disabled) {
  background: #d0d0d0;
}

.cell.revealed {
  background: #fff;
  cursor: default;
}

.cell.flagged {
  background: #c0c0c0;
}

.cell.focused {
  outline: 3px solid #0066cc;
  outline-offset: -3px;
  z-index: 10;
}

/* Number colors */
.cell.n1 { color: blue; }
.cell.n2 { color: green; }
.cell.n3 { color: red; }
.cell.n4 { color: darkblue; }
.cell.n5 { color: darkred; }
.cell.n6 { color: cyan; }
.cell.n7 { color: black; }
.cell.n8 { color: gray; }

/* Disable pointer events when game over */
.cell.disabled {
  cursor: not-allowed;
  pointer-events: none;
}
```

**Acceptance criteria**:
- [ ] Covered cells distinct from revealed
- [ ] Numbers have distinct colors
- [ ] Focus ring visible and clear
- [ ] Hover effect subtle

#### 4.2 Board & App Layout
**File**: `src/styles/Board.module.css`

```css
.board {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 1px;
  max-width: min(90vw, 450px);
  margin: 0 auto;
  background: #999;
  padding: 1px;
  border: 2px solid #666;
}

@media (max-width: 480px) {
  .board {
    max-width: 95vw;
  }
}

@media (min-width: 1024px) {
  .board {
    max-width: 500px;
  }
}
```

**File**: `src/styles/App.module.css`

```css
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f0f0f0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.app h1 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
}

@media (max-width: 480px) {
  .app h1 {
    font-size: 1.5rem;
  }
}
```

**Acceptance criteria**:
- [ ] Layout centered on all screen sizes
- [ ] No horizontal scroll on mobile (320px min)
- [ ] Grid scales proportionally

#### 4.3 HUD Styling
**File**: `src/styles/Hud.module.css`

```css
.hud {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: min(90vw, 450px);
  margin: 0 auto 20px;
  padding: 15px;
  background: #fff;
  border: 2px solid #999;
  border-radius: 8px;
  gap: 20px;
}

.mine-counter,
.timer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.reset-button {
  font-size: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  line-height: 1;
  transition: transform 0.1s;
}

.reset-button:hover {
  transform: scale(1.1);
}

.reset-button:active {
  transform: scale(0.95);
}

.game-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2.5rem;
  font-weight: bold;
  padding: 30px 50px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  z-index: 1000;
}

.game-message.win {
  background: #4caf50;
  color: white;
}

.game-message.lose {
  background: #f44336;
  color: white;
}
```

**Acceptance criteria**:
- [ ] HUD elements evenly spaced
- [ ] Reset button has hover effect
- [ ] Win/lose messages centered and prominent
- [ ] Responsive on all screen sizes

---

## Phase 5: Testing & Quality Assurance (2-3 hours)

### Objectives
- Achieve >80% test coverage
- Ensure all acceptance criteria met
- Fix any bugs discovered

### Tasks

#### 5.1 Unit Test Coverage
**Target files**:
- `src/lib/generator.ts` - 100% coverage
- `src/lib/floodFill.ts` - 100% coverage
- `src/hooks/useMinesweeper.ts` - >90% coverage

**Run coverage**:
```bash
npm test -- --coverage
```

**Acceptance criteria**:
- [ ] All unit tests pass
- [ ] Coverage >80% for logic files
- [ ] No skipped or pending tests

#### 5.2 Component Testing
**Files to test**:
- `src/components/Cell.test.tsx`
- `src/components/Board.test.tsx`
- `src/components/Hud.test.tsx`

**Example test** (`Cell.test.tsx`):
```typescript
describe('Cell', () => {
  it('calls onReveal when clicked', () => {
    const onReveal = vi.fn();
    const cell: Cell = {
      row: 0,
      col: 0,
      isMine: false,
      adjacentMines: 0,
      state: 'covered'
    };
    
    render(<Cell cell={cell} onReveal={onReveal} onFlag={() => {}} disabled={false} focused={false} />);
    
    fireEvent.click(screen.getByRole('gridcell'));
    expect(onReveal).toHaveBeenCalledWith(0, 0);
  });
  
  it('calls onFlag on right-click', () => {
    const onFlag = vi.fn();
    const cell: Cell = { /* ... */ };
    
    render(<Cell cell={cell} onReveal={() => {}} onFlag={onFlag} disabled={false} focused={false} />);
    
    fireEvent.contextMenu(screen.getByRole('gridcell'));
    expect(onFlag).toHaveBeenCalledWith(0, 0);
  });
  
  // More tests...
});
```

**Acceptance criteria**:
- [ ] All component tests pass
- [ ] Key interactions tested (click, right-click, keyboard)
- [ ] Accessibility attributes present

#### 5.3 Integration Testing
**Test full game flow**:
```typescript
describe('Full game flow', () => {
  it('allows user to win a game', () => {
    render(<App />);
    
    // Click first cell to start
    // Mock board to have known configuration
    // Reveal all safe cells
    // Check win message appears
  });
  
  it('allows user to lose a game', () => {
    // Similar to above but reveal a mine
  });
  
  it('allows user to flag cells', () => {
    // Right-click cells
    // Check flag count updates
  });
});
```

**Acceptance criteria**:
- [ ] Can complete full game in tests
- [ ] Win/lose conditions trigger correctly
- [ ] Flag mechanics work

#### 5.4 Manual QA Checklist
**Desktop testing** (Chrome, Firefox, Safari, Edge):
- [ ] Game loads without errors
- [ ] Can click cells to reveal
- [ ] Can right-click to flag
- [ ] Keyboard navigation works (arrows, Enter, Space, F, R)
- [ ] Timer starts and stops correctly
- [ ] Mine counter updates
- [ ] Win message appears on win
- [ ] Lose message appears on loss
- [ ] Reset button works at all times
- [ ] First click never reveals mine (test 10+ times)
- [ ] Flood fill works (reveals connected empties)

**Mobile testing** (iOS Safari, Android Chrome):
- [ ] Game loads and scales correctly
- [ ] Can tap to reveal cells
- [ ] Long-press (>300ms) toggles flag
- [ ] Context menu doesn't appear
- [ ] Touch targets are comfortable (44×44px min)
- [ ] No horizontal scroll
- [ ] Game playable in portrait and landscape

**Accessibility testing**:
- [ ] Can navigate with keyboard only
- [ ] Focus ring visible on all focusable elements
- [ ] ARIA labels present on cells
- [ ] Screen reader announces cell states (test with VoiceOver/NVDA)
- [ ] Contrast ratios meet WCAG AA (use browser DevTools)

---

## Phase 6: Deployment & Documentation (2 hours)

### Objectives
- Deploy to GitHub Pages
- Write README documentation
- Final verification

### Tasks

#### 6.1 Deployment Configuration
**Update `package.json`**:
```json
{
  "name": "minesweeper-minimal",
  "version": "1.0.0",
  "homepage": "https://waldekswo.github.io/Arena2Ex4",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint . --ext ts,tsx --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

**Verify `vite.config.ts`**:
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/Arena2Ex4/', // Must match repo name
  // ... rest of config
});
```

**Install gh-pages**:
```bash
npm install -D gh-pages
```

**Deploy**:
```bash
npm run deploy
```

**Acceptance criteria**:
- [ ] Build completes without errors
- [ ] Deploy pushes to gh-pages branch
- [ ] Application accessible at https://waldekswo.github.io/Arena2Ex4/

#### 6.2 README Documentation
**File**: `README.md`

**Sections to include**:
1. **Project Overview** - What is Minesweeper Minimal
2. **Features** - List of implemented features
3. **Demo** - Link to live demo
4. **Installation** - How to run locally
5. **How to Play** - Game rules and controls
6. **Development** - Tech stack, project structure
7. **Testing** - How to run tests
8. **Deployment** - How to deploy
9. **License** - MIT or similar

**Example README**:
```markdown
# Minesweeper Minimal

A minimal, accessible implementation of the classic Minesweeper game built with React 18, TypeScript, and Vite.

🎮 **[Play Now](https://waldekswo.github.io/Arena2Ex4/)**

## Features

- 9×9 grid with 10 mines
- First-click safety (never reveals a mine)
- Flood-fill algorithm for revealing empty cells
- Flag placement with right-click/long-press
- Timer and mine counter
- Keyboard navigation (arrows, Enter, Space, F, R)
- Mobile touch support
- Fully accessible (ARIA, keyboard-only playable)
- Responsive design (works on mobile and desktop)

## How to Play

**Desktop**:
- Left-click to reveal a cell
- Right-click to place/remove flag
- Arrow keys to navigate
- Enter/Space to reveal focused cell
- F to flag focused cell
- R to restart game

**Mobile**:
- Tap to reveal a cell
- Long-press (>300ms) to place/remove flag

**Goal**: Reveal all cells that don't contain mines without clicking on any mine.

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/waldekswo/Arena2Ex4.git
   cd Arena2Ex4/my-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

## Development

### Tech Stack
- **Framework**: React 18
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite 5
- **Testing**: Vitest + React Testing Library
- **Styling**: CSS Modules
- **Deployment**: GitHub Pages

### Project Structure
```
src/
├── components/      # React components
│   ├── App.tsx
│   ├── Board.tsx
│   ├── Cell.tsx
│   └── Hud.tsx
├── hooks/           # Custom React hooks
│   └── useMinesweeper.ts
├── lib/             # Pure utility functions
│   ├── generator.ts
│   ├── floodFill.ts
│   └── types.ts
└── styles/          # CSS Modules
```

### Testing
Run tests:
```bash
npm test              # Watch mode
npm test -- --run     # Run once
npm test -- --coverage  # With coverage
```

### Building
Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Deployment

Deploy to GitHub Pages:
```bash
npm run deploy
```

This will:
1. Build the project
2. Push the `dist/` folder to `gh-pages` branch
3. Application will be available at https://waldekswo.github.io/Arena2Ex4/

## License

MIT License - see LICENSE file for details

## Acknowledgements

- Inspired by classic Microsoft Minesweeper
- Built as part of Spec-Driven Development methodology
```

**Acceptance criteria**:
- [ ] README complete and accurate
- [ ] Live demo link works
- [ ] Installation instructions correct
- [ ] All commands tested

#### 6.3 Final Verification
**Pre-deployment checklist**:
- [ ] All tests pass (`npm test -- --run`)
- [ ] Build succeeds (`npm run build`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] Local preview works (`npm run preview`)
- [ ] All acceptance criteria from spec met

**Post-deployment checklist**:
- [ ] GitHub Pages URL accessible
- [ ] No 404 errors in browser console
- [ ] Game fully functional on production
- [ ] Works on mobile (test on real device)
- [ ] Works on desktop (test multiple browsers)
- [ ] Lighthouse scores acceptable (run audit)

---

## Risk Mitigation

### Known Risks & Solutions

| Risk | Solution |
|------|----------|
| **CRA to Vite migration breaks existing code** | Do migration in feature branch, test thoroughly before merge |
| **Long-press conflicts with mobile browser features** | Use `preventDefault()` on touch events, test on multiple devices |
| **Timer drift** | Use `Date.now()` for elapsed time calculation, not interval counter |
| **Flood fill stack overflow** | Already using iterative BFS, test with large empty areas |
| **GitHub Pages deployment fails** | Verify `base` path in vite.config, test with `npm run preview` first |

### Contingency Plans

**If Vite migration takes too long**:
- Keep CRA for MVP
- Migrate to Vite post-MVP

**If testing falls behind schedule**:
- Prioritize core logic tests (generator, floodFill, hook)
- Component tests can be minimal for MVP

**If deployment issues arise**:
- Fall back to manual deployment (build locally, push to gh-pages)
- Document issue for post-MVP fix

---

## Success Criteria

### Definition of Done

This feature is **complete** when:

1. ✅ **Functional Requirements**:
   - [ ] Game is playable from start to finish
   - [ ] Can win by revealing all safe cells
   - [ ] Can lose by revealing a mine
   - [ ] First click never reveals a mine
   - [ ] Flags work on right-click (desktop) and long-press (mobile)
   - [ ] Timer starts on first reveal, stops on game end
   - [ ] Mine counter updates correctly
   - [ ] Reset button works at all times

2. ✅ **Technical Requirements**:
   - [ ] TypeScript strict mode, no `any` types
   - [ ] All tests pass
   - [ ] Test coverage >80% for logic
   - [ ] Build succeeds
   - [ ] No ESLint errors
   - [ ] Code formatted with Prettier

3. ✅ **Accessibility Requirements**:
   - [ ] Fully playable with keyboard only
   - [ ] ARIA labels on all interactive elements
   - [ ] Focus ring visible
   - [ ] Works with screen readers

4. ✅ **Deployment**:
   - [ ] Deployed to GitHub Pages
   - [ ] Accessible at public URL
   - [ ] Works on mobile and desktop
   - [ ] No console errors

5. ✅ **Documentation**:
   - [ ] README with setup instructions
   - [ ] How to play documented
   - [ ] Development guide included

---

## Timeline Summary

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| 1. Setup | Vite config, dependencies, tools | 2-3 hours |
| 2. Core Logic | Types, generator, flood fill, hook | 4-5 hours |
| 3. UI Components | Cell, Board, Hud, App | 3-4 hours |
| 4. Styling | CSS Modules, responsive design | 2-3 hours |
| 5. Testing | Unit, component, integration tests | 2-3 hours |
| 6. Deployment | GitHub Pages, README | 2 hours |
| **Total** | | **16-20 hours** |

**Target Completion**: MVP ready within 1 week of starting development

---

## Next Steps After Plan Approval

1. **Create feature branch**: `git checkout -b 001-minesweeper-game`
2. **Start with Phase 1**: Begin Vite migration
3. **Commit frequently**: After each completed task
4. **Run tests continuously**: Ensure nothing breaks
5. **Deploy early**: Test deployment process before final release

---

**End of Implementation Plan**

*This plan should be reviewed and approved before implementation begins. Any deviations during implementation should be documented with rationale.*
