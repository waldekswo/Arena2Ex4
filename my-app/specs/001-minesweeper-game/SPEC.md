# Feature Specification: Minesweeper Minimal Game

**Feature Branch**: `001-minesweeper-game`  
**Created**: 2025-12-03  
**Status**: Draft  
**Input**: User description: "Implementacja bardzo prostej wersji gry Saper w React, zgodnie z konstytucją projektu, z możliwością wdrożenia na GitHub Pages."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Basic Gameplay (Priority: P1)

**Scenario**: As a player, I want to start a new game and reveal cells to find all safe cells without hitting a mine.

**User Journey**:
1. Player opens the application in browser
2. Sees a 9×9 grid of covered cells with a HUD showing "10" mines and "0:00" timer
3. Clicks on any cell (first click)
4. Timer starts, cell is revealed (never a mine)
5. If revealed cell has 0 adjacent mines, connected empty cells are automatically revealed
6. Player continues clicking cells to reveal safe areas
7. When all non-mine cells are revealed, game shows "YOU WIN!" message
8. Timer stops, all cells become non-interactive

**Why this priority**: Core game loop - without this, there is no game.

**Independent Test**: Can complete a full game from start to win condition by clicking cells until all 71 safe cells (81 - 10 mines) are revealed.

**Acceptance Criteria**:
- [ ] 9×9 grid (81 cells) renders on page load
- [ ] HUD displays mine counter starting at "10" and timer at "0:00"
- [ ] First click on any cell reveals it and is never a mine
- [ ] Timer starts on first click and increments every second
- [ ] Empty cells (0 adjacent mines) trigger flood-fill reveal of connected empty cells
- [ ] Numbered cells (1-8 adjacent mines) display the number in distinct colors
- [ ] Win condition: all 71 non-mine cells revealed, game status shows "won"
- [ ] On win: timer stops, cells become non-interactive, win message displays

---

### User Story 2 - Flag Placement and Mine Counter (Priority: P1)

**Scenario**: As a player, I want to mark suspected mine locations with flags to track my progress and see how many mines remain.

**User Journey**:
1. Player is in an active game (timer running)
2. Right-clicks (desktop) or long-presses >300ms (mobile) on a covered cell
3. Cell displays flag icon (🚩)
4. Mine counter decreases by 1 (e.g., "10" → "9")
5. Right-clicks/long-presses the same cell again
6. Flag is removed, mine counter increases by 1
7. Player can flag up to 10 cells (mine counter reaches "0")
8. Flagged cells cannot be revealed by left-click (prevents accidental reveal)

**Why this priority**: Essential strategy mechanic - players need to mark suspected mines.

**Independent Test**: Can flag any covered cell, see counter update, unflag it, and verify counter returns to original value. Flagged cells resist left-click reveal.

**Acceptance Criteria**:
- [ ] Right-click on covered cell toggles flag on/off
- [ ] Long-press (>300ms) on touch devices toggles flag on/off
- [ ] Context menu is prevented on right-click/long-press
- [ ] Flag icon (🚩) appears on flagged cells
- [ ] Mine counter updates: decreases when flag added, increases when removed
- [ ] Mine counter can go negative (more flags than mines - allowed behavior)
- [ ] Flagged cells ignore left-click/tap reveal attempts
- [ ] Revealed cells cannot be flagged

---

### User Story 3 - Lose Condition and Game Over (Priority: P1)

**Scenario**: As a player, I want to know immediately when I hit a mine and see where all mines were located.

**User Journey**:
1. Player is in an active game
2. Clicks on a cell that contains a mine
3. Cell reveals mine icon (💣), game status changes to "lost"
4. Timer stops immediately
5. All mine locations are revealed on the board (💣)
6. All cells become non-interactive (except reset button)
7. Lose message displays (e.g., "GAME OVER!")

**Why this priority**: Core game rule - hitting a mine must end the game.

**Independent Test**: Can trigger lose condition by revealing a mine, verify all mines show and game stops.

**Acceptance Criteria**:
- [ ] Revealing a mine immediately ends the game (status: "lost")
- [ ] Timer stops on mine reveal
- [ ] All 10 mine locations are revealed (show 💣 icon)
- [ ] Correctly flagged mines show flag + mine icon
- [ ] Incorrectly flagged cells (not mines) show visual indicator of error
- [ ] All cells become non-interactive after loss
- [ ] Lose message displays prominently
- [ ] Reset button remains functional

---

### User Story 4 - Game Restart (Priority: P1)

**Scenario**: As a player, I want to restart the game at any time to try again or start fresh.

**User Journey**:
1. Player is in any game state (idle, running, won, lost)
2. Clicks the reset button (🔄) in HUD
3. Board resets: all cells become covered, no flags
4. Mine counter resets to "10"
5. Timer resets to "0:00" (not running)
6. Game status returns to "idle"
7. New mine positions are generated (will be placed on first click)

**Why this priority**: Essential for replayability - must allow quick restart.

**Independent Test**: Can click reset at any point and verify full game state reset.

**Acceptance Criteria**:
- [ ] Reset button visible in HUD at all times
- [ ] Click resets all game state: board, timer, counter, status
- [ ] All cells return to covered state
- [ ] All flags removed
- [ ] Mine counter shows "10"
- [ ] Timer shows "0:00" and is stopped
- [ ] Game status is "idle"
- [ ] Mines will be regenerated on next first click

---

### User Story 5 - Keyboard Navigation (Priority: P2)

**Scenario**: As a keyboard user, I want to navigate the grid and interact with cells using only keyboard controls.

**User Journey**:
1. Player loads the game, focuses on the grid
2. Uses arrow keys (↑↓←→) to move focus between cells
3. Focus ring is clearly visible on focused cell
4. Presses Enter or Space to reveal the focused cell
5. Presses "F" key to toggle flag on focused cell
6. Presses "R" key to restart game
7. Can complete full game using only keyboard

**Why this priority**: Accessibility requirement - keyboard-only users must be able to play.

**Independent Test**: Complete a game using only keyboard (no mouse/touch).

**Acceptance Criteria**:
- [ ] Arrow keys navigate between cells (wrap at edges optional)
- [ ] Visible focus ring on focused cell (min 2px, high contrast)
- [ ] Enter key reveals focused cell
- [ ] Space key reveals focused cell
- [ ] "F" key toggles flag on focused cell
- [ ] "R" key restarts game
- [ ] Tab navigation includes reset button
- [ ] Focus management: on game end, focus moves to reset button

---

### User Story 6 - Mobile Touch Support (Priority: P2)

**Scenario**: As a mobile user, I want to play the game on my phone with touch gestures.

**User Journey**:
1. Player opens game on mobile browser (portrait or landscape)
2. Taps a cell to reveal it
3. Long-presses (>300ms) on a cell to toggle flag
4. Sees haptic feedback or visual indication during long-press
5. Grid scales to fit screen width (min 320px)
6. Touch targets are at least 44×44px
7. Can complete full game on mobile

**Why this priority**: Mobile users are significant portion of web traffic.

**Independent Test**: Complete a game on mobile device (iOS Safari, Android Chrome).

**Acceptance Criteria**:
- [ ] Tap reveals cell (equivalent to left-click)
- [ ] Long-press (>300ms) toggles flag (equivalent to right-click)
- [ ] Long-press does not trigger context menu
- [ ] Visual feedback during long-press (e.g., slight scale/opacity change)
- [ ] Touch targets minimum 44×44px (WCAG 2.1 Level AAA)
- [ ] Grid responsive: scales to viewport width (320px - 768px)
- [ ] No horizontal scroll required
- [ ] Pinch-zoom disabled on game area (prevent accidental zoom)

---

## Technical Implementation *(mandatory)*

### Architecture Overview

**Component Hierarchy**:
```
App
├── Hud
│   ├── MineCounter
│   ├── Timer
│   └── ResetButton
└── Board
    └── Cell (×81)
```

**State Management**: Single custom hook `useMinesweeper` manages all game state using React `useState` and `useReducer`.

**Data Flow**:
1. User interaction → Event handler in Cell component
2. Event handler → Action dispatch to useMinesweeper hook
3. Hook updates state → React re-renders affected components
4. Memoization (React.memo, useMemo) prevents unnecessary re-renders

---

### Core Data Types (`src/lib/types.ts`)

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

---

### Algorithm: Mine Generation (`src/lib/generator.ts`)

**Function**: `generateBoard(rows: number, cols: number, mineCount: number, firstClick: Position): Board`

**Algorithm**:
1. Create empty grid (rows × cols)
2. Initialize all cells: `isMine: false`, `adjacentMines: 0`, `state: 'covered'`
3. Generate list of all positions EXCEPT firstClick position and its 8 neighbors
4. Randomly select `mineCount` positions from available list
5. Place mines at selected positions (`isMine: true`)
6. For each cell, calculate `adjacentMines` by checking 8 neighbors
7. Return board

**Rationale**: First click safety is guaranteed by excluding first click and neighbors from mine placement.

**Time Complexity**: O(rows × cols) for board creation + O(rows × cols) for adjacency calculation = O(n) where n = total cells

**Test Cases**:
- Exactly `mineCount` mines placed
- First click cell has `isMine: false`
- All 8 neighbors of first click have `isMine: false`
- All adjacentMines counts are accurate

---

### Algorithm: Flood Fill (`src/lib/floodFill.ts`)

**Function**: `floodFill(board: Board, startRow: number, startCol: number): Position[]`

**Algorithm** (Iterative BFS):
1. Initialize queue with start position
2. Initialize visited set
3. Initialize result array (cells to reveal)
4. While queue not empty:
   a. Dequeue position
   b. If already visited, skip
   c. Mark as visited
   d. Add to result
   e. If cell has adjacentMines > 0, do not add neighbors (stop condition)
   f. If cell has adjacentMines === 0, add all 8 unvisited neighbors to queue
5. Return result array

**Rationale**: Iterative BFS prevents stack overflow on large empty areas. Stops at numbered cells.

**Time Complexity**: O(n) where n = cells revealed (worst case: entire board)

**Test Cases**:
- Single empty cell surrounded by numbers: reveals only itself
- Large empty area: reveals all connected empties + border numbers
- Corner/edge cases: correctly handles boundaries
- No duplicates in result array

---

### State Management: `useMinesweeper` Hook

**Hook Interface**:
```typescript
interface UseMinesweeperReturn {
  gameState: GameState;
  revealCell: (row: number, col: number) => void;
  toggleFlag: (row: number, col: number) => void;
  resetGame: () => void;
}
```

**Internal State**:
- `board`: Current board state
- `status`: Game status
- `flagCount`: Number of flags placed
- `revealedCount`: Number of revealed cells
- `startTime`: Timestamp of first reveal (null if not started)
- `elapsedTime`: Seconds elapsed (updated via useEffect interval)

**Actions**:

1. **revealCell(row, col)**:
   - If game not running, generate board (first click) and start timer
   - If cell is flagged or revealed, ignore
   - If cell is mine, set status to "lost", reveal all mines
   - If cell is empty (adjacentMines === 0), run flood fill and reveal all returned cells
   - If cell is numbered, reveal only that cell
   - Increment revealedCount
   - Check win condition: `revealedCount === (total cells - mine count)`
   - If won, set status to "won", stop timer

2. **toggleFlag(row, col)**:
   - If cell is revealed, ignore
   - If cell is covered, set to flagged, increment flagCount
   - If cell is flagged, set to covered, decrement flagCount

3. **resetGame()**:
   - Reset all state to initial values
   - Generate new empty board (mines placed on first click)

**Timer Management** (useEffect):
```typescript
useEffect(() => {
  if (status !== 'running') return;
  
  const interval = setInterval(() => {
    setElapsedTime(Math.floor((Date.now() - startTime!) / 1000));
  }, 1000);
  
  return () => clearInterval(interval);
}, [status, startTime]);
```

---

### Component Specifications

#### **App.tsx**
- Main container, renders Hud and Board
- Provides game state from `useMinesweeper` hook via props
- Handles global keyboard shortcuts (R for reset)

#### **Hud.tsx**
- Displays mine counter: `{mineCount - flagCount}` (can be negative)
- Displays timer: formatted as MM:SS (e.g., "03:42")
- Renders reset button with click handler

#### **Board.tsx**
- Renders 9×9 grid of Cell components
- Props: `board`, `onReveal`, `onFlag`, `disabled` (when game over)
- Adds `role="grid"` for accessibility
- Handles keyboard navigation (arrow keys, Enter, Space, F)
- Manages focused cell state

#### **Cell.tsx**
- Props: `cell`, `onReveal`, `onFlag`, `disabled`, `focused`
- Renders cell based on state:
  - `covered`: Light gray background, no content
  - `flagged`: Flag icon (🚩)
  - `revealed` + mine: Mine icon (💣)
  - `revealed` + adjacentMines > 0: Number with color class
  - `revealed` + adjacentMines === 0: Empty
- Click handlers: onClick → onReveal, onContextMenu → onFlag
- Touch handlers: onTouchStart/End → long-press detection (300ms)
- ARIA: `role="gridcell"`, `aria-label` describing cell state
- Memoized with React.memo (prevent re-renders)

---

### Styling Architecture (`src/styles/`)

**CSS Modules Structure**:
- `App.module.css`: Global layout, centering
- `Hud.module.css`: HUD bar, counters, button
- `Board.module.css`: Grid layout, gap, responsive sizing
- `Cell.module.css`: Cell states, colors, hover/focus

**Cell State Classes**:
```css
.cell-covered { background: #c0c0c0; }
.cell-revealed { background: #fff; }
.cell-flagged::after { content: '🚩'; }
.cell-mine::after { content: '💣'; }
.cell-n1 { color: blue; }
.cell-n2 { color: green; }
.cell-n3 { color: red; }
.cell-n4 { color: darkblue; }
.cell-n5 { color: darkred; }
.cell-n6 { color: cyan; }
.cell-n7 { color: black; }
.cell-n8 { color: gray; }
```

**Responsive Grid**:
```css
.board {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 2px;
  max-width: min(90vw, 450px); /* 50px per cell max */
}

@media (max-width: 480px) {
  .board {
    max-width: 95vw;
  }
}
```

---

### Accessibility Implementation

**ARIA Labels** (dynamic, generated in Cell.tsx):
```typescript
const getAriaLabel = (cell: Cell): string => {
  if (cell.state === 'covered') {
    return `Covered cell at row ${cell.row + 1}, column ${cell.col + 1}`;
  }
  if (cell.state === 'flagged') {
    return `Flagged cell at row ${cell.row + 1}, column ${cell.col + 1}`;
  }
  if (cell.isMine) {
    return `Mine at row ${cell.row + 1}, column ${cell.col + 1}`;
  }
  if (cell.adjacentMines > 0) {
    return `Cell with ${cell.adjacentMines} adjacent mines at row ${cell.row + 1}, column ${cell.col + 1}`;
  }
  return `Empty cell at row ${cell.row + 1}, column ${cell.col + 1}`;
};
```

**Keyboard Navigation** (Board.tsx):
```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowUp': moveFocus(-1, 0); break;
    case 'ArrowDown': moveFocus(1, 0); break;
    case 'ArrowLeft': moveFocus(0, -1); break;
    case 'ArrowRight': moveFocus(0, 1); break;
    case 'Enter':
    case ' ': revealFocusedCell(); break;
    case 'f':
    case 'F': toggleFlagFocusedCell(); break;
  }
};
```

---

### Testing Strategy

**Unit Tests** (Vitest):

1. **generator.ts**:
   ```typescript
   describe('generateBoard', () => {
     it('places exactly 10 mines', () => { ... });
     it('never places mine at first click position', () => { ... });
     it('never places mine adjacent to first click', () => { ... });
     it('calculates adjacentMines correctly', () => { ... });
   });
   ```

2. **floodFill.ts**:
   ```typescript
   describe('floodFill', () => {
     it('reveals single empty cell with numbered neighbors', () => { ... });
     it('reveals large connected empty area', () => { ... });
     it('stops at numbered cells (does not reveal beyond)', () => { ... });
     it('handles corner and edge cases', () => { ... });
   });
   ```

3. **useMinesweeper.ts**:
   ```typescript
   describe('useMinesweeper', () => {
     it('starts in idle state', () => { ... });
     it('transitions to running on first reveal', () => { ... });
     it('transitions to lost when mine revealed', () => { ... });
     it('transitions to won when all safe cells revealed', () => { ... });
     it('updates flag count correctly', () => { ... });
     it('timer starts on first reveal', () => { ... });
   });
   ```

**Component Tests** (React Testing Library):

1. **Cell.tsx**:
   ```typescript
   it('calls onReveal on click', () => { ... });
   it('calls onFlag on right-click', () => { ... });
   it('calls onFlag on long-press (>300ms)', () => { ... });
   it('shows flag icon when flagged', () => { ... });
   it('shows mine icon when revealed mine', () => { ... });
   ```

2. **Board.tsx**:
   ```typescript
   it('renders 81 cells', () => { ... });
   it('handles keyboard navigation', () => { ... });
   it('disables interactions when game over', () => { ... });
   ```

3. **Integration Test**:
   ```typescript
   it('completes full game: start, reveal, flag, win', () => { ... });
   ```

---

## Dependencies & Setup *(mandatory)*

### Required Dependencies

**Production**:
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

**Development**:
```json
{
  "vite": "^5.0.0",
  "@vitejs/plugin-react": "^4.2.0",
  "typescript": "^5.3.0",
  "vitest": "^1.0.0",
  "@testing-library/react": "^14.1.0",
  "@testing-library/jest-dom": "^6.1.5",
  "@testing-library/user-event": "^14.5.0",
  "eslint": "^8.55.0",
  "prettier": "^3.1.0",
  "gh-pages": "^6.1.0"
}
```

### Vite Configuration (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Arena2Ex4/', // Important for GitHub Pages
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
```

### TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Package Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

---

## Deployment Configuration *(mandatory)*

### GitHub Pages Setup

**Option 1: gh-pages CLI** (Simpler)

1. Install: `npm install gh-pages --save-dev`
2. Add to `package.json`:
   ```json
   {
     "homepage": "https://waldekswo.github.io/Arena2Ex4"
   }
   ```
3. Deploy: `npm run deploy`

**Option 2: GitHub Actions** (Recommended - Already in place)

Update `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy Minesweeper

on:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: my-app/package-lock.json
      
      - name: Install dependencies
        run: |
          cd my-app
          npm ci
      
      - name: Run tests
        run: |
          cd my-app
          npm test -- --run
      
      - name: Build
        run: |
          cd my-app
          npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./my-app/dist
```

**Important**: Ensure `base: '/Arena2Ex4/'` in `vite.config.ts` matches repo name.

---

## Acceptance Criteria & Validation *(mandatory)*

### Functional Acceptance

- [ ] **Game Initialization**: Page loads with 9×9 covered grid, mine counter "10", timer "0:00"
- [ ] **First Click Safety**: First clicked cell is never a mine, game starts (timer begins)
- [ ] **Reveal Mechanic**: Clicking covered cell reveals it; numbers show adjacent mine count
- [ ] **Flood Fill**: Clicking empty cell reveals all connected empty cells + border numbers
- [ ] **Flag Toggle**: Right-click (desktop) or long-press (mobile) toggles flag on/off
- [ ] **Mine Counter**: Updates correctly when flags added/removed (can go negative)
- [ ] **Timer**: Starts on first reveal, increments every second, stops on game end
- [ ] **Win Condition**: Revealing all 71 non-mine cells triggers win state, shows message
- [ ] **Lose Condition**: Revealing any mine triggers lose state, reveals all mines
- [ ] **Reset**: Clicking reset button resets game to initial state
- [ ] **Keyboard Nav**: Arrow keys navigate, Enter/Space reveal, F flags, R resets
- [ ] **Mobile Support**: Works on touch devices with tap/long-press

### Technical Acceptance

- [ ] **TypeScript**: No `any` types, strict mode enabled, all functions typed
- [ ] **Tests Pass**: All unit and component tests pass (`npm test`)
- [ ] **Lint Clean**: No ESLint errors or warnings (`npm run lint`)
- [ ] **Build Success**: Production build completes without errors (`npm run build`)
- [ ] **Bundle Size**: Total bundle < 150KB gzipped
- [ ] **Performance**: Lighthouse Performance score > 90

### Accessibility Acceptance

- [ ] **ARIA**: `role="grid"`, `role="gridcell"`, dynamic `aria-label` on all cells
- [ ] **Keyboard**: Fully playable with keyboard only (no mouse)
- [ ] **Focus Visible**: Clear focus ring on focused elements (min 2px, high contrast)
- [ ] **Screen Reader**: VoiceOver/NVDA announces cell states correctly
- [ ] **Contrast**: All text meets WCAG AA contrast ratio (4.5:1)

### Deployment Acceptance

- [ ] **GitHub Pages**: Application accessible at `https://waldekswo.github.io/Arena2Ex4/`
- [ ] **No 404s**: All assets load (check browser console)
- [ ] **Mobile**: Works on iOS Safari and Android Chrome
- [ ] **Desktop**: Works on Chrome, Firefox, Safari, Edge (last 2 versions)

---

## Out of Scope (Explicit Exclusions) *(mandatory)*

The following features are **explicitly excluded** from this specification:

1. **Multiple Difficulty Levels**: No easy/medium/hard/custom options
2. **High Score Persistence**: No localStorage, no backend, no score tracking
3. **Undo Functionality**: No ability to undo moves
4. **Hint System**: No hints or solver assistance
5. **Animations**: No complex transitions, explosions, or effects (only hover/focus)
6. **Sound Effects**: No audio of any kind
7. **Themes/Skins**: No dark mode, no color schemes
8. **Multiplayer**: No network play, no leaderboards
9. **Tutorial/Help**: No in-app instructions (README only)
10. **Statistics**: No game history, win rate, etc.

---

## Risk Assessment & Mitigation *(mandatory)*

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Flood fill stack overflow on large empty areas | Low | High | Use iterative BFS, not recursion |
| Poor mobile performance on low-end devices | Medium | Medium | Memoize Cell components, limit re-renders |
| Long-press conflicts with context menu | High | Medium | `preventDefault()` on contextmenu event |
| Timer drift over long games | Low | Low | Use `Date.now()` diff, not interval count |
| First-click mine generation edge case | Low | High | Comprehensive unit tests for generator |

### UX Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Touch targets too small on mobile | Medium | High | Minimum 44×44px, test on real devices |
| Unclear win/lose state | Medium | Medium | Clear message overlay, distinct styling |
| Accidental flag toggle on mobile | Medium | Medium | 300ms threshold, visual feedback during long-press |
| Keyboard navigation confusing | Low | Medium | Clear focus ring, document shortcuts |

### Deployment Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| GitHub Pages base path incorrect | High | High | Test locally with `npm run preview`, verify `base` in vite.config |
| Build fails in CI | Medium | Medium | Ensure all dependencies in package.json, test build locally first |
| CORS issues with assets | Low | Medium | Use relative paths, no external resources |

---

## Success Metrics *(mandatory)*

### Quantitative Metrics

- **Test Coverage**: > 80% for `src/lib/` and `src/hooks/`
- **Bundle Size**: < 150KB gzipped
- **Lighthouse Scores**:
  - Performance: > 90
  - Accessibility: > 95
  - Best Practices: > 90
  - SEO: > 80
- **Build Time**: < 30 seconds
- **First Contentful Paint**: < 1.5s

### Qualitative Metrics

- **User Testing**: 3 users can complete a game without instructions (README allowed)
- **Accessibility Audit**: No critical issues in axe DevTools or Lighthouse
- **Code Review**: Passes team review (if applicable) with no major concerns
- **Cross-Browser**: Works identically in Chrome, Firefox, Safari, Edge

### Completion Definition

Feature is **complete** when:
1. All acceptance criteria are met
2. All tests pass
3. Application is deployed and publicly accessible
4. README includes setup and play instructions
5. No known critical bugs

---

## Timeline Estimate *(optional)*

**Total Estimated Effort**: 16-20 hours (for experienced React/TypeScript developer)

**Phase Breakdown**:
- **Phase 1** (4-5h): Core logic (generator, floodFill, types, useMinesweeper hook)
- **Phase 2** (3-4h): UI components (Cell, Board, Hud, App)
- **Phase 3** (2-3h): Styling (CSS Modules, responsive, accessibility)
- **Phase 4** (3-4h): Keyboard nav, mobile touch support
- **Phase 5** (2-3h): Testing (unit + component tests)
- **Phase 6** (2h): Deployment config, documentation, final QA

---

## Notes & Assumptions *(optional)*

### Assumptions

1. **Browser Support**: Modern browsers only (ES2020+), no polyfills needed
2. **Device Support**: Desktop (1024px+) and mobile (320px-768px), no tablet-specific optimizations
3. **Network**: Deployed as static site, no API calls, works offline after load
4. **User Expertise**: No tutorial needed; users familiar with Minesweeper rules

### Design Decisions Rationale

1. **Why iterative flood-fill instead of recursive?**
   - Prevents stack overflow on large empty areas
   - More predictable performance characteristics

2. **Why mine counter can go negative?**
   - Simplifies logic (no need to cap flags)
   - Gives feedback that user over-flagged
   - Classic Minesweeper behavior

3. **Why 300ms for long-press threshold?**
   - Standard mobile UI convention
   - Long enough to avoid accidental triggers
   - Short enough to feel responsive

4. **Why no animations?**
   - Keeps bundle small
   - Better performance on low-end devices
   - Aligns with "minimal" project goal

### Future Considerations (Post-MVP)

If this MVP is successful, potential next steps:
1. Add difficulty levels (beginner: 8×8/10, intermediate: 16×16/40, expert: 30×16/99)
2. Persist high scores to localStorage
3. Add dark mode theme toggle
4. Implement PWA for offline play
5. Add sound effects toggle

---

**End of Specification**

*This specification should be used as the blueprint for implementation. Any deviations must be documented with rationale.*
