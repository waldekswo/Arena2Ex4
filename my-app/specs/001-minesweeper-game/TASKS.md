# Task List: Minesweeper Minimal Implementation

**Feature**: Minesweeper Minimal Game  
**Feature Branch**: `001-minesweeper-game`  
**Created**: 2025-12-03  
**Status**: Ready for Implementation  
**Total Estimated Time**: 16-20 hours  
**Total Tasks**: 45

---

## Task Organization

Tasks are organized by phase and dependency order. Each task should take 30-60 minutes to complete.

**Legend**:
- 🔴 **Blocking**: Must be completed before other tasks can proceed
- 🟡 **Important**: High priority, affects multiple components
- 🟢 **Optional**: Can be deferred if time-constrained
- ⚡ **Quick**: < 30 minutes

---

## Phase 1: Project Setup & Configuration (7 tasks, ~2-3 hours)

### Task 1.1: Initialize Vite + TypeScript Project 🔴
**Estimated time**: 30 min  
**Description**: Create new Vite project with React + TypeScript template parallel to existing CRA project.

**Steps**:
1. Navigate to `/workspaces/Arena2Ex4/`
2. Create new project: `npm create vite@latest my-app-vite -- --template react-ts`
3. Copy existing files from `my-app/` that should be preserved (CONSTITUTION.md, specs/, etc.)
4. Verify build works: `cd my-app-vite && npm install && npm run dev`

**Acceptance criteria**:
- [ ] New Vite project created
- [ ] TypeScript configured
- [ ] Dev server runs without errors
- [ ] Existing documentation preserved

---

### Task 1.2: Configure Vite for GitHub Pages 🔴
**Estimated time**: 20 min  
**Description**: Set up Vite configuration with correct base path for deployment.

**Steps**:
1. Create/modify `vite.config.ts`:
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     base: '/Arena2Ex4/',
   })
   ```
2. Update `package.json` homepage field
3. Test with `npm run build && npm run preview`

**Acceptance criteria**:
- [ ] Base path configured correctly
- [ ] Build produces correct asset paths
- [ ] Preview works locally

**Dependencies**: Task 1.1

---

### Task 1.3: Install Testing Dependencies 🔴
**Estimated time**: 20 min  
**Description**: Set up Vitest and React Testing Library.

**Steps**:
1. Install: `npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`
2. Add test config to `vite.config.ts`:
   ```typescript
   test: {
     globals: true,
     environment: 'jsdom',
     setupFiles: './src/setupTests.ts',
   }
   ```
3. Create `src/setupTests.ts` with `import '@testing-library/jest-dom'`
4. Add scripts to `package.json`: `"test": "vitest"`, `"test:run": "vitest --run"`

**Acceptance criteria**:
- [ ] Vitest installed and configured
- [ ] Can run `npm test`
- [ ] Testing utilities available

**Dependencies**: Task 1.1

---

### Task 1.4: Configure ESLint + Prettier ⚡
**Estimated time**: 15 min  
**Description**: Set up code quality tools.

**Steps**:
1. Install: `npm install -D eslint prettier eslint-config-prettier`
2. Create `.eslintrc.json` (use Vite defaults)
3. Create `.prettierrc`: `{ "semi": true, "singleQuote": true, "tabWidth": 2 }`
4. Add scripts: `"lint": "eslint . --ext ts,tsx --max-warnings 0"`, `"format": "prettier --write \"src/**/*.{ts,tsx,css}\""`

**Acceptance criteria**:
- [ ] ESLint runs without errors
- [ ] Prettier formats code
- [ ] Scripts work

**Dependencies**: Task 1.1

---

### Task 1.5: Create Project Directory Structure 🔴 ⚡
**Estimated time**: 10 min  
**Description**: Set up folder structure for organized code.

**Steps**:
1. Create directories:
   ```
   src/
   ├── components/
   ├── hooks/
   ├── lib/
   └── styles/
   ```
2. Add `.gitkeep` files to empty directories
3. Move existing `App.tsx` and cleanup

**Acceptance criteria**:
- [ ] All directories exist
- [ ] Structure matches architecture plan

**Dependencies**: Task 1.1

---

### Task 1.6: Configure TypeScript Strict Mode 🟡
**Estimated time**: 20 min  
**Description**: Enable strict TypeScript for type safety.

**Steps**:
1. Update `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "noUnusedLocals": true,
       "noUnusedParameters": true,
       "noFallthroughCasesInSwitch": true,
       // ... other options
     }
   }
   ```
2. Fix any type errors in existing code
3. Verify build still works

**Acceptance criteria**:
- [ ] Strict mode enabled
- [ ] No TypeScript errors
- [ ] Build succeeds

**Dependencies**: Task 1.1

---

### Task 1.7: Update Package Scripts 🟡 ⚡
**Estimated time**: 10 min  
**Description**: Add all necessary npm scripts for development and deployment.

**Steps**:
1. Update `package.json` scripts:
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "tsc && vite build",
       "preview": "vite preview",
       "test": "vitest",
       "test:run": "vitest --run",
       "test:coverage": "vitest --coverage",
       "lint": "eslint . --ext ts,tsx --max-warnings 0",
       "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```
2. Test each script

**Acceptance criteria**:
- [ ] All scripts defined
- [ ] Scripts execute without errors

**Dependencies**: Tasks 1.2, 1.3, 1.4

---

## Phase 2: Core Game Logic (10 tasks, ~4-5 hours)

### Task 2.1: Define TypeScript Types 🔴
**Estimated time**: 30 min  
**Description**: Create all type definitions for the game.

**File**: `src/lib/types.ts`

**Steps**:
1. Define `CellState`, `GameStatus` types
2. Define `Cell`, `Board`, `GameState`, `Position` interfaces
3. Export all types
4. Add JSDoc comments for complex types

**Acceptance criteria**:
- [ ] All types compile
- [ ] Types cover all game entities
- [ ] No `any` types used

**Dependencies**: Task 1.5

---

### Task 2.2: Implement Board Generator Function 🔴
**Estimated time**: 45 min  
**Description**: Create algorithm to generate game board with mines.

**File**: `src/lib/generator.ts`

**Steps**:
1. Implement `generateBoard(rows, cols, mineCount, firstClick)` function
2. Create empty grid
3. Get safe positions (exclude firstClick and neighbors)
4. Randomly place mines
5. Calculate adjacentMines for all cells
6. Return Board

**Acceptance criteria**:
- [ ] Function returns valid Board
- [ ] Exactly `mineCount` mines placed
- [ ] First click position and neighbors have no mines
- [ ] All adjacentMines calculated correctly

**Dependencies**: Task 2.1

---

### Task 2.3: Write Tests for Board Generator 🟡
**Estimated time**: 45 min  
**Description**: Comprehensive test coverage for generator.

**File**: `src/lib/generator.test.ts`

**Steps**:
1. Test: correct board dimensions
2. Test: exact mine count
3. Test: first click never has mine
4. Test: neighbors of first click never have mines
5. Test: adjacentMines calculation accuracy
6. Test: edge cases (corners, edges)

**Acceptance criteria**:
- [ ] All tests pass
- [ ] Coverage > 95% for generator.ts
- [ ] Edge cases covered

**Dependencies**: Task 2.2

---

### Task 2.4: Implement Flood Fill Algorithm 🔴
**Estimated time**: 45 min  
**Description**: Create iterative BFS flood fill for revealing empty cells.

**File**: `src/lib/floodFill.ts`

**Steps**:
1. Implement `floodFill(board, startRow, startCol)` function
2. Use queue-based BFS (not recursive)
3. Track visited cells to avoid duplicates
4. Stop at cells with adjacentMines > 0
5. Return array of positions to reveal

**Acceptance criteria**:
- [ ] Function returns Position array
- [ ] Reveals all connected empty cells
- [ ] Stops at numbered cells
- [ ] No duplicates in result
- [ ] No stack overflow

**Dependencies**: Task 2.1

---

### Task 2.5: Write Tests for Flood Fill 🟡
**Estimated time**: 45 min  
**Description**: Test flood fill algorithm thoroughly.

**File**: `src/lib/floodFill.test.ts`

**Steps**:
1. Create test boards with known configurations
2. Test: single empty cell
3. Test: large connected empty area
4. Test: stops at numbered cells
5. Test: corner and edge positions
6. Test: no duplicates returned

**Acceptance criteria**:
- [ ] All tests pass
- [ ] Coverage > 95% for floodFill.ts
- [ ] Various board configurations tested

**Dependencies**: Task 2.4

---

### Task 2.6: Create useMinesweeper Hook - Initial State 🔴
**Estimated time**: 45 min  
**Description**: Set up hook with initial game state.

**File**: `src/hooks/useMinesweeper.ts`

**Steps**:
1. Define `UseMinesweeperReturn` interface
2. Create hook function signature
3. Initialize state with `useState<GameState>`
4. Create empty board (no mines yet)
5. Set status to 'idle'
6. Return state and placeholder functions

**Acceptance criteria**:
- [ ] Hook compiles
- [ ] Returns correct interface
- [ ] Initial state is valid
- [ ] Can be rendered in component

**Dependencies**: Task 2.1

---

### Task 2.7: Implement revealCell Action 🔴
**Estimated time**: 60 min  
**Description**: Core game action - revealing cells.

**File**: `src/hooks/useMinesweeper.ts`

**Steps**:
1. Implement `revealCell(row, col)` function
2. Handle first click: generate board with `generateBoard`
3. Ignore flagged or already revealed cells
4. Check if mine: set status to 'lost', reveal all mines
5. Check if empty: run `floodFill`, reveal all returned cells
6. Check if numbered: reveal single cell
7. Check win condition: `revealedCount === totalCells - mineCount`

**Acceptance criteria**:
- [ ] First click generates board
- [ ] Revealing mine ends game
- [ ] Empty cells trigger flood fill
- [ ] Win condition detected
- [ ] State updates correctly

**Dependencies**: Tasks 2.2, 2.4, 2.6

---

### Task 2.8: Implement toggleFlag Action 🟡
**Estimated time**: 30 min  
**Description**: Allow players to mark suspected mines.

**File**: `src/hooks/useMinesweeper.ts`

**Steps**:
1. Implement `toggleFlag(row, col)` function
2. Ignore revealed cells
3. If covered: set to flagged, increment flagCount
4. If flagged: set to covered, decrement flagCount
5. Update state immutably

**Acceptance criteria**:
- [ ] Flag toggles on/off
- [ ] Flag count updates
- [ ] Revealed cells can't be flagged
- [ ] State updates correctly

**Dependencies**: Task 2.6

---

### Task 2.9: Implement resetGame Action and Timer 🟡
**Estimated time**: 45 min  
**Description**: Reset game and manage timer.

**File**: `src/hooks/useMinesweeper.ts`

**Steps**:
1. Implement `resetGame()` function: reset all state to initial
2. Add `useEffect` for timer:
   - Only run when status === 'running'
   - Use `setInterval` to update elapsedTime every second
   - Calculate elapsed time from `startTime` using `Date.now()`
   - Clean up interval on unmount
3. Start timer on first reveal
4. Stop timer on win/lose

**Acceptance criteria**:
- [ ] Reset clears all state
- [ ] Timer starts on first reveal
- [ ] Timer increments every second
- [ ] Timer stops on game end
- [ ] No memory leaks

**Dependencies**: Task 2.6

---

### Task 2.10: Write Tests for useMinesweeper Hook 🟡
**Estimated time**: 60 min  
**Description**: Test all hook functionality.

**File**: `src/hooks/useMinesweeper.test.ts`

**Steps**:
1. Use `@testing-library/react-hooks` or `renderHook`
2. Test: initial idle state
3. Test: first reveal transitions to running
4. Test: revealing mine transitions to lost
5. Test: revealing all safe cells transitions to won
6. Test: flag toggle updates count
7. Test: reset clears state
8. Test: timer starts and increments

**Acceptance criteria**:
- [ ] All tests pass
- [ ] Coverage > 85% for hook
- [ ] All state transitions tested

**Dependencies**: Tasks 2.7, 2.8, 2.9

---

## Phase 3: UI Components (8 tasks, ~3-4 hours)

### Task 3.1: Create Cell Component 🔴
**Estimated time**: 45 min  
**Description**: Individual cell component with click handlers.

**File**: `src/components/Cell.tsx`

**Steps**:
1. Define `CellProps` interface
2. Create functional component
3. Implement `handleClick` for reveal
4. Implement `handleContextMenu` for flag (preventDefault!)
5. Add `getCellContent()` helper for display
6. Add basic className logic for states
7. Wrap with `React.memo`

**Acceptance criteria**:
- [ ] Component renders
- [ ] Click triggers onReveal
- [ ] Right-click triggers onFlag
- [ ] Context menu prevented
- [ ] Memoized

**Dependencies**: Task 2.1

---

### Task 3.2: Add Touch Support to Cell 🟡
**Estimated time**: 45 min  
**Description**: Long-press detection for mobile flag toggle.

**File**: `src/components/Cell.tsx`

**Steps**:
1. Add state for `longPressTimer`
2. Implement `handleTouchStart`: set 300ms timer
3. Implement `handleTouchEnd`: clear timer
4. On timer completion: trigger `onFlag`
5. Add visual feedback during long-press (optional)

**Acceptance criteria**:
- [ ] Long-press (>300ms) triggers flag
- [ ] Tap (<300ms) does not trigger flag
- [ ] Timer cleans up properly

**Dependencies**: Task 3.1

---

### Task 3.3: Add ARIA to Cell Component 🟡
**Estimated time**: 30 min  
**Description**: Make cells accessible with ARIA labels.

**File**: `src/components/Cell.tsx`

**Steps**:
1. Add `role="gridcell"`
2. Create `getAriaLabel(cell)` function:
   - Covered: "Covered cell at row X, column Y"
   - Flagged: "Flagged cell at row X, column Y"
   - Revealed mine: "Mine at row X, column Y"
   - Revealed number: "Cell with N adjacent mines at row X, column Y"
   - Empty: "Empty cell at row X, column Y"
3. Add `aria-label` prop

**Acceptance criteria**:
- [ ] `role="gridcell"` present
- [ ] Dynamic aria-label based on cell state
- [ ] Screen reader announces correctly

**Dependencies**: Task 3.1

---

### Task 3.4: Create Board Component 🔴
**Estimated time**: 45 min  
**Description**: Grid container with keyboard navigation.

**File**: `src/components/Board.tsx`

**Steps**:
1. Define `BoardProps` interface
2. Create functional component
3. Add `focusedCell` state (row, col)
4. Render grid of Cell components (map over board)
5. Add `role="grid"` and `tabIndex={0}`
6. Pass props to Cell components

**Acceptance criteria**:
- [ ] Renders 81 cells in grid
- [ ] Props passed correctly to cells
- [ ] Grid is focusable

**Dependencies**: Task 3.1

---

### Task 3.5: Add Keyboard Navigation to Board 🟡
**Estimated time**: 60 min  
**Description**: Arrow keys, Enter, Space, F key support.

**File**: `src/components/Board.tsx`

**Steps**:
1. Implement `handleKeyDown` function:
   - ArrowUp/Down/Left/Right: move focus
   - Enter/Space: reveal focused cell
   - F: toggle flag on focused cell
   - Prevent default on all
2. Update `focusedCell` state on arrow keys
3. Pass `focused` prop to Cell components
4. Ensure focus doesn't go out of bounds

**Acceptance criteria**:
- [ ] Arrow keys navigate grid
- [ ] Enter/Space reveal cell
- [ ] F toggles flag
- [ ] Focus stays within grid bounds
- [ ] Focused cell visually indicated

**Dependencies**: Task 3.4

---

### Task 3.6: Create HUD Component 🔴
**Estimated time**: 45 min  
**Description**: Display counters, timer, and reset button.

**File**: `src/components/Hud.tsx`

**Steps**:
1. Define `HudProps` interface
2. Create functional component
3. Add mine counter: `mineCount - flagCount`
4. Add timer: format as MM:SS
5. Add reset button with click handler
6. Add win/lose message overlays

**Acceptance criteria**:
- [ ] Mine counter displays correctly
- [ ] Timer formats as MM:SS
- [ ] Reset button works
- [ ] Win/lose messages show

**Dependencies**: None (standalone component)

---

### Task 3.7: Create Main App Component 🔴
**Estimated time**: 30 min  
**Description**: Wire all components together.

**File**: `src/App.tsx`

**Steps**:
1. Use `useMinesweeper(9, 9, 10)` hook
2. Render Hud with props from gameState
3. Render Board with props from gameState
4. Pass disabled prop based on game status
5. Add global R key listener for reset
6. Add title and basic layout

**Acceptance criteria**:
- [ ] App renders without errors
- [ ] All components connected
- [ ] Game is playable
- [ ] R key resets game

**Dependencies**: Tasks 2.10, 3.5, 3.6

---

### Task 3.8: Write Component Tests 🟡
**Estimated time**: 60 min  
**Description**: Test component behavior.

**Files**: `src/components/*.test.tsx`

**Steps**:
1. Test Cell: click, right-click, long-press, display states
2. Test Board: renders cells, keyboard navigation
3. Test Hud: displays correct values, reset button
4. Test App: integration test (start game, reveal, flag, win/lose)

**Acceptance criteria**:
- [ ] All component tests pass
- [ ] Key interactions tested
- [ ] Integration test passes

**Dependencies**: Task 3.7

---

## Phase 4: Styling (5 tasks, ~2-3 hours)

### Task 4.1: Create Cell Styles 🔴
**Estimated time**: 45 min  
**Description**: Style cell states with CSS Modules.

**File**: `src/styles/Cell.module.css`

**Steps**:
1. Create base `.cell` class (size, border, centering)
2. Add `.covered` class (gray background, gradient)
3. Add `.revealed` class (white background)
4. Add `.flagged` class (show 🚩)
5. Add `.n1` through `.n8` classes (number colors)
6. Add `.focused` class (outline ring)
7. Add hover effect for covered cells
8. Import and apply in Cell.tsx

**Acceptance criteria**:
- [ ] All cell states styled
- [ ] Numbers have distinct colors
- [ ] Focus ring visible
- [ ] Hover effect subtle

**Dependencies**: Task 3.1

---

### Task 4.2: Create Board Styles 🔴
**Estimated time**: 30 min  
**Description**: Style grid layout with responsive sizing.

**File**: `src/styles/Board.module.css`

**Steps**:
1. Create `.board` class with CSS Grid
2. Set `grid-template-columns: repeat(9, 1fr)`
3. Add gap, border, background
4. Set max-width: `min(90vw, 450px)`
5. Add media query for mobile (<480px): `max-width: 95vw`
6. Import and apply in Board.tsx

**Acceptance criteria**:
- [ ] Grid displays 9×9
- [ ] Responsive on mobile and desktop
- [ ] No horizontal scroll

**Dependencies**: Task 3.4

---

### Task 4.3: Create HUD Styles 🟡
**Estimated time**: 30 min  
**Description**: Style header bar with counters and button.

**File**: `src/styles/Hud.module.css`

**Steps**:
1. Create `.hud` class (flexbox, spacing, border)
2. Style `.mine-counter` and `.timer` (icons, numbers)
3. Style `.reset-button` (emoji button, hover effect)
4. Style `.game-message` (overlay, centered, prominent)
5. Add `.win` and `.lose` variants (colors)
6. Import and apply in Hud.tsx

**Acceptance criteria**:
- [ ] HUD elements evenly spaced
- [ ] Reset button has hover effect
- [ ] Win/lose messages prominent
- [ ] Responsive

**Dependencies**: Task 3.6

---

### Task 4.4: Create App Layout Styles 🟡
**Estimated time**: 30 min  
**Description**: Overall page layout and typography.

**File**: `src/styles/App.module.css`

**Steps**:
1. Create `.app` class (flexbox, centering, min-height)
2. Style `h1` (title, margin, font-size)
3. Add global background color
4. Set font-family (system fonts)
5. Add media query for mobile title size
6. Import and apply in App.tsx

**Acceptance criteria**:
- [ ] App centered on page
- [ ] Works on all screen sizes
- [ ] Typography readable

**Dependencies**: Task 3.7

---

### Task 4.5: Add Global Styles and Reset ⚡
**Estimated time**: 20 min  
**Description**: CSS reset and global base styles.

**File**: `src/index.css`

**Steps**:
1. Add box-sizing reset
2. Remove default margins
3. Set touch-action on body (prevent zoom)
4. Add any global CSS variables (optional)
5. Ensure no conflicts with component styles

**Acceptance criteria**:
- [ ] Consistent styling across browsers
- [ ] No unexpected margins/padding
- [ ] Touch-friendly

**Dependencies**: None

---

## Phase 5: Testing & Quality (6 tasks, ~2-3 hours)

### Task 5.1: Achieve Test Coverage Goals 🟡
**Estimated time**: 45 min  
**Description**: Ensure >80% coverage for core logic.

**Steps**:
1. Run `npm run test:coverage`
2. Identify untested code paths
3. Add missing tests for edge cases
4. Focus on `lib/` and `hooks/` directories
5. Re-run coverage report

**Acceptance criteria**:
- [ ] Coverage >80% for `src/lib/`
- [ ] Coverage >80% for `src/hooks/`
- [ ] All edge cases tested

**Dependencies**: Tasks 2.3, 2.5, 2.10, 3.8

---

### Task 5.2: Fix ESLint Warnings 🟡 ⚡
**Estimated time**: 30 min  
**Description**: Clean up code quality issues.

**Steps**:
1. Run `npm run lint`
2. Fix all errors and warnings
3. Add `// eslint-disable-next-line` only if absolutely necessary (document why)
4. Ensure strict TypeScript compliance
5. Run lint again to verify

**Acceptance criteria**:
- [ ] `npm run lint` shows 0 errors
- [ ] `npm run lint` shows 0 warnings
- [ ] No `any` types

**Dependencies**: All implementation tasks

---

### Task 5.3: Manual Desktop QA Testing 🟡
**Estimated time**: 45 min  
**Description**: Test game on multiple desktop browsers.

**Browsers**: Chrome, Firefox, Safari, Edge

**Test cases**:
1. Game loads without errors
2. Can reveal cells with left-click
3. Can flag cells with right-click
4. Keyboard navigation works (arrows, Enter, Space, F, R)
5. Timer starts on first reveal
6. Mine counter updates when flagging
7. Win condition triggers correctly (test multiple games)
8. Lose condition triggers correctly (test multiple games)
9. First click never reveals mine (test 10+ games)
10. Reset button works at all game states
11. Flood fill reveals connected empties

**Acceptance criteria**:
- [ ] All test cases pass on all browsers
- [ ] No console errors
- [ ] Game is playable

**Dependencies**: Task 4.4

---

### Task 5.4: Manual Mobile QA Testing 🟡
**Estimated time**: 45 min  
**Description**: Test on real mobile devices or browser DevTools.

**Devices**: iOS Safari, Android Chrome

**Test cases**:
1. Game loads and scales correctly
2. Can tap to reveal cells
3. Long-press (>300ms) toggles flag
4. Context menu doesn't appear on long-press
5. Touch targets are comfortable (not too small)
6. No horizontal scroll at 320px width
7. Timer and counters readable
8. Reset button easy to tap
9. Win/lose messages clear
10. Portrait and landscape orientations work

**Acceptance criteria**:
- [ ] All test cases pass on tested devices
- [ ] Responsive on small screens (320px min)
- [ ] Touch interactions smooth

**Dependencies**: Task 4.4

---

### Task 5.5: Accessibility Audit 🟡
**Estimated time**: 45 min  
**Description**: Verify accessibility features work.

**Steps**:
1. Test keyboard navigation without mouse
2. Test with screen reader (VoiceOver on Mac or NVDA on Windows):
   - Navigate to cells
   - Verify aria-labels announced correctly
   - Test game flow with screen reader only
3. Run Lighthouse accessibility audit
4. Check color contrast ratios (DevTools)
5. Verify focus indicators visible

**Acceptance criteria**:
- [ ] Can complete game with keyboard only
- [ ] Screen reader announces cell states
- [ ] Lighthouse accessibility score >95
- [ ] Contrast ratios meet WCAG AA (4.5:1)
- [ ] Focus rings visible

**Dependencies**: Task 4.4

---

### Task 5.6: Performance Testing 🟢
**Estimated time**: 30 min  
**Description**: Verify performance requirements.

**Steps**:
1. Run Lighthouse performance audit
2. Check bundle size: `npm run build`, inspect `dist/` size
3. Test flood fill performance (time it)
4. Check for unnecessary re-renders (React DevTools Profiler)
5. Test on low-end device or throttled CPU

**Acceptance criteria**:
- [ ] Lighthouse Performance score >90
- [ ] Bundle size <150KB gzipped
- [ ] Flood fill <50ms
- [ ] No janky interactions

**Dependencies**: Task 4.4

---

## Phase 6: Deployment & Documentation (9 tasks, ~2 hours)

### Task 6.1: Install gh-pages Package ⚡
**Estimated time**: 5 min  
**Description**: Add deployment tooling.

**Steps**:
1. Install: `npm install -D gh-pages`
2. Verify scripts in package.json (should be done in Task 1.7)
3. Check homepage field set correctly

**Acceptance criteria**:
- [ ] gh-pages installed
- [ ] Deploy script present

**Dependencies**: Task 1.7

---

### Task 6.2: Test Local Production Build 🟡 ⚡
**Estimated time**: 15 min  
**Description**: Verify build works before deploying.

**Steps**:
1. Run `npm run build`
2. Check for errors in build output
3. Inspect `dist/` folder (assets, index.html)
4. Run `npm run preview`
5. Test game in preview mode
6. Check asset paths load correctly

**Acceptance criteria**:
- [ ] Build succeeds
- [ ] Preview works locally
- [ ] All assets load
- [ ] Game functional in preview

**Dependencies**: All Phase 4 tasks

---

### Task 6.3: Deploy to GitHub Pages 🔴
**Estimated time**: 15 min  
**Description**: First deployment to gh-pages branch.

**Steps**:
1. Ensure all changes committed to git
2. Run `npm run deploy`
3. Wait for deployment to complete
4. Check GitHub repo settings → Pages
5. Verify source is gh-pages branch

**Acceptance criteria**:
- [ ] Deploy completes without errors
- [ ] gh-pages branch exists on GitHub
- [ ] GitHub Pages source configured

**Dependencies**: Tasks 6.1, 6.2

---

### Task 6.4: Verify Production Deployment 🟡
**Estimated time**: 20 min  
**Description**: Test live URL.

**Steps**:
1. Wait 2-3 minutes for GitHub Pages to propagate
2. Open https://waldekswo.github.io/Arena2Ex4/
3. Check browser console for errors (especially 404s)
4. Play a complete game
5. Test on mobile device
6. Verify all functionality works

**Acceptance criteria**:
- [ ] URL accessible
- [ ] No 404 errors
- [ ] Game fully functional
- [ ] Works on mobile and desktop

**Dependencies**: Task 6.3

---

### Task 6.5: Update GitHub Actions Workflow (Optional) 🟢
**Estimated time**: 30 min  
**Description**: Automate deployment with GitHub Actions.

**File**: `.github/workflows/deploy.yml`

**Steps**:
1. Update existing workflow or create new
2. Add Vite build step
3. Configure deployment to gh-pages
4. Test workflow by pushing to main

**Acceptance criteria**:
- [ ] Workflow runs on push to main
- [ ] Build succeeds
- [ ] Deployment automatic

**Dependencies**: Task 6.3

---

### Task 6.6: Write README Documentation 🟡
**Estimated time**: 45 min  
**Description**: Complete project documentation.

**File**: `README.md`

**Sections**:
1. Project title and description
2. Live demo link
3. Features list
4. How to play (controls)
5. Installation instructions
6. Development setup
7. Testing commands
8. Deployment instructions
9. Project structure
10. Tech stack
11. License

**Acceptance criteria**:
- [ ] README complete
- [ ] Live demo link works
- [ ] Instructions accurate
- [ ] Commands tested

**Dependencies**: Task 6.4

---

### Task 6.7: Add Project Screenshots (Optional) 🟢 ⚡
**Estimated time**: 15 min  
**Description**: Visual documentation.

**Steps**:
1. Take screenshot of game in initial state
2. Take screenshot of game in progress
3. Take screenshot of win state
4. Create `docs/images/` or `screenshots/` folder
5. Add images to README

**Acceptance criteria**:
- [ ] Screenshots captured
- [ ] Images in repo
- [ ] Shown in README

**Dependencies**: Task 6.6

---

### Task 6.8: Create LICENSE File ⚡
**Estimated time**: 5 min  
**Description**: Add open source license.

**File**: `LICENSE`

**Steps**:
1. Choose license (MIT recommended)
2. Copy license text from choosealicense.com
3. Fill in year and name
4. Commit to repo

**Acceptance criteria**:
- [ ] LICENSE file exists
- [ ] Proper format
- [ ] Mentioned in README

**Dependencies**: None

---

### Task 6.9: Final Acceptance Checklist 🔴
**Estimated time**: 30 min  
**Description**: Verify all acceptance criteria met.

**Steps**:
1. Review SPEC.md acceptance criteria
2. Check each item systematically
3. Test on multiple devices/browsers
4. Verify all features work
5. Check documentation complete
6. Run all tests one final time

**Master checklist**:
- [ ] **Functional**: Can play, win, lose; first click safe; flags work; timer/counter work; reset works
- [ ] **Technical**: TS strict, tests pass, lint clean, build succeeds, bundle <150KB
- [ ] **Accessibility**: Keyboard playable, ARIA present, focus visible, screen reader works
- [ ] **Deployment**: Public URL works, no 404s, mobile & desktop tested
- [ ] **Documentation**: README complete, instructions accurate, license present

**Acceptance criteria**:
- [ ] All checklist items verified
- [ ] Ready for public release

**Dependencies**: All previous tasks

---

## Summary

### Total Task Count: 45 tasks

**By Phase**:
- Phase 1 (Setup): 7 tasks
- Phase 2 (Logic): 10 tasks
- Phase 3 (UI): 8 tasks
- Phase 4 (Styles): 5 tasks
- Phase 5 (Testing): 6 tasks
- Phase 6 (Deploy): 9 tasks

**By Priority**:
- 🔴 Blocking: 13 tasks (must complete first)
- 🟡 Important: 20 tasks (high priority)
- 🟢 Optional: 4 tasks (can defer)
- ⚡ Quick: 8 tasks (<30 min)

**Critical Path** (minimum viable implementation):
1. Tasks 1.1 → 1.2 → 1.3 → 1.5 (Setup)
2. Tasks 2.1 → 2.2 → 2.4 → 2.6 → 2.7 → 2.8 → 2.9 (Core Logic)
3. Tasks 3.1 → 3.4 → 3.6 → 3.7 (Basic UI)
4. Tasks 4.1 → 4.2 (Basic Styles)
5. Tasks 6.1 → 6.2 → 6.3 → 6.4 → 6.9 (Deploy)

**Estimated total time**: 16-20 hours for complete implementation

---

## Usage Notes

### How to Use This Task List

1. **Work sequentially within each phase** - Dependencies matter
2. **Complete blocking (🔴) tasks first** - Others depend on them
3. **Commit after each task** - Small, focused commits
4. **Run tests frequently** - Catch issues early
5. **Mark tasks complete** - Track progress

### Task Completion Format

When completing a task:
```markdown
- [x] Task X.Y completed (Date, Time spent)
```

### If You Get Stuck

- Review the SPEC.md for detailed requirements
- Check PLAN.md for algorithm explanations
- Consult CONSTITUTION.md for standards
- Ask for clarification if acceptance criteria unclear

---

**End of Task List**

*Ready to start implementation! Begin with Task 1.1.*
