# Project Constitution: Minesweeper Minimal

**Project Name**: Minesweeper Minimal  
**Technology Stack**: React 18 + TypeScript + Vite  
**Deployment Target**: GitHub Pages  
**Created**: 2025-12-03  
**Status**: Active

---

## 1. Project Vision & Goals

### Primary Goal
Create a minimal, browser-based implementation of classic Minesweeper game that is:
- Lightweight and responsive
- Easy to run and deploy
- Accessible and keyboard-navigable
- Deployed on GitHub Pages

### Success Criteria
- Playable game with win/lose conditions on 9×9 grid with 10 mines
- First click never hits a mine
- Flag functionality works on right-click (desktop) and long-press (mobile)
- Timer and mine counter work correctly and stop on game end
- Application is publicly accessible via GitHub Pages URL

---

## 2. Scope Definition

### In Scope (MVP Features)
1. **Single Difficulty Level**: 9×9 grid, 10 mines
2. **Core Interactions**:
   - Left-click/tap: reveal cell
   - Right-click/long-press (>300ms): toggle flag
3. **Game Mechanics**:
   - Flood-fill algorithm for revealing zeros
   - Lose condition: revealing a mine
   - Win condition: all non-mine cells revealed
   - Game restart functionality
4. **UI Elements**:
   - Mine counter (remaining mines − flags placed)
   - Timer (starts on first reveal, stops on win/lose)
   - Reset button
5. **Deployment**: GitHub Pages via gh-pages branch or GitHub Actions

### Explicitly Out of Scope
- Multiple difficulty levels
- High score persistence / leaderboards
- Backend / API integrations
- Advanced animations, themes, sound effects
- Routing / multi-page navigation
- User authentication

---

## 3. Technical Architecture

### Technology Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules (no UI frameworks)
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier (default configurations)
- **Deployment**: GitHub Pages

### Project Structure
```
src/
├── App.tsx                 # Main application layout
├── components/
│   ├── Board.tsx          # Grid rendering
│   ├── Cell.tsx           # Individual cell component
│   └── Hud.tsx            # Mine counter, timer, reset button
├── hooks/
│   └── useMinesweeper.ts  # Game logic (state, actions)
├── lib/
│   ├── generator.ts       # Board generation with mines
│   ├── floodFill.ts       # Zero-reveal algorithm
│   └── types.ts           # Type definitions
└── styles/                # CSS Modules
```

### Key Technical Decisions
1. **Mine Generation**: Mines are placed AFTER first click to ensure first cell is never a mine
2. **Flood Fill**: Use iterative BFS/DFS (not recursive) for zero-reveal
3. **State Management**: Custom hook (useMinesweeper) with React state
4. **Responsive Design**: Grid scales to viewport width
5. **No External UI Libraries**: Keep bundle small

---

## 4. Code Quality Standards

### TypeScript Usage
- **Strict mode enabled** in tsconfig.json
- All functions must have explicit return types
- No `any` types unless absolutely necessary (document why)
- Use proper type definitions from `types.ts`

### Component Guidelines
- **Functional components only** (no class components)
- **Props interfaces** defined for all components
- **Single responsibility**: Each component does one thing well
- **Composition over inheritance**

### Naming Conventions
- Components: PascalCase (e.g., `Board.tsx`, `Cell.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useMinesweeper.ts`)
- Utils/Lib: camelCase (e.g., `generator.ts`, `floodFill.ts`)
- CSS Modules: `.module.css` suffix
- CSS classes: kebab-case (e.g., `cell-covered`, `cell-revealed`)

### Code Style
- **ESLint + Prettier**: Run before every commit
- **Max function length**: ~50 lines (refactor if longer)
- **Comments**: Explain "why", not "what"
- **No magic numbers**: Use named constants

---

## 5. Testing Requirements

### Minimum Test Coverage
All core game logic must be tested:

1. **generator.ts**:
   - Correct number of mines placed
   - First clicked cell never contains a mine
   - Mine distribution is within grid bounds

2. **floodFill.ts**:
   - Correctly reveals all connected zero cells
   - Stops at numbered cells (doesn't reveal beyond)
   - Handles edge cases (corners, edges)

3. **useMinesweeper.ts**:
   - Game state transitions: `idle → running → won/lost`
   - Flag toggle works correctly
   - Mine counter updates properly
   - Timer starts on first reveal and stops on game end

### Testing Philosophy
- **Unit tests** for logic (lib/, hooks/)
- **Component tests** for UI interactions (components/)
- **No E2E tests** required for MVP
- **Test user journeys**, not implementation details

---

## 6. Accessibility (A11y) Standards

### ARIA Implementation
- `role="grid"` on board container
- `role="gridcell"` on each cell
- `aria-label` for each cell state:
  - Covered: "Covered cell at row X, column Y"
  - Flagged: "Flagged cell at row X, column Y"
  - Revealed: "Cell with N adjacent mines" or "Empty cell"
  - Mine (after game over): "Mine at row X, column Y"

### Keyboard Navigation
- **Arrow keys**: Navigate between cells
- **Enter/Space**: Reveal cell (equivalent to left-click)
- **F key**: Toggle flag on focused cell
- **R key**: Restart game
- **Visible focus ring** on focused cell

### Visual Accessibility
- **Minimum contrast ratio**: 4.5:1 for text
- **Color is not the only indicator**: Use icons/patterns for flags and mines
- **Clear hover/focus states**

---

## 7. User Experience (UX/UI) Guidelines

### Layout
- **Top bar (HUD)**: Mine counter, timer, reset button
- **Game board**: Grid of cells, centered on page
- **Responsive**: Works on mobile (min 320px) and desktop (up to 1920px)

### Visual States
Cell types with distinct styling:
- `.covered`: Default covered state (light gray)
- `.revealed`: Uncovered, shows number or empty
- `.flagged`: Shows flag icon (🚩)
- `.mine`: Shows mine icon (💣) after game over
- `.n1` to `.n8`: Number colors (1=blue, 2=green, 3=red, etc.)

### Interactions
- **Hover effect**: Subtle highlight on covered cells
- **No animations** except simple hover/focus (keep it minimal)
- **Disabled state**: After game ends, cells are not interactive (except reset)

### Mobile Considerations
- **Touch targets**: Minimum 44×44px
- **Long-press**: 300ms threshold for flag toggle
- **Prevent context menu**: On right-click/long-press

---

## 8. Performance Requirements

### Bundle Size
- **Target**: < 150KB gzipped total bundle
- **Use Vite code splitting** if needed
- **No heavy dependencies** (moment.js, lodash, etc.)

### Runtime Performance
- **First render**: < 100ms for board generation
- **Flood fill**: < 50ms for full board reveal
- **60 FPS**: Smooth interactions, no janky animations

### Optimization Strategies
- **React.memo** for Cell components (avoid re-renders)
- **useMemo** for expensive calculations
- **useCallback** for event handlers passed as props

---

## 9. Deployment Process

### GitHub Pages Setup

#### Option 1: gh-pages Package
```json
// package.json
{
  "homepage": "https://waldekswo.github.io/Arena2Ex4",
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```
Steps:
1. `npm install gh-pages --save-dev`
2. `npm run build`
3. `npm run deploy`

#### Option 2: GitHub Actions (Preferred)
- Use existing `.github/workflows/deploy.yml`
- Build Vite app (`npm run build`)
- Deploy `dist/` folder to `gh-pages` branch
- Ensure `base: '/Arena2Ex4/'` in `vite.config.ts`

### Pre-Deployment Checklist
- [ ] All tests passing (`npm test`)
- [ ] Build successful (`npm run build`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Formatted with Prettier (`npm run format`)
- [ ] Manual QA on local build (`npm run preview`)

---

## 10. Development Workflow

### Branch Strategy
- **main**: Production-ready code, deployed to GitHub Pages
- **Feature branches**: `001-feature-name`, `002-feature-name`, etc.
- **No direct commits to main**: All changes via pull requests

### Commit Guidelines
- **Conventional Commits** format:
  - `feat: add flood fill algorithm`
  - `fix: prevent mine on first click`
  - `test: add tests for generator`
  - `docs: update README with deploy instructions`

### Code Review Criteria
- [ ] Passes all tests
- [ ] Follows naming conventions
- [ ] Includes necessary tests
- [ ] Accessible (ARIA, keyboard nav)
- [ ] No console errors/warnings
- [ ] Works on mobile and desktop

---

## 11. Maintenance & Support

### Browser Support
- **Modern browsers**: Chrome, Firefox, Safari, Edge (last 2 versions)
- **No IE11 support** required

### Known Limitations (Documented)
- Single difficulty level only
- No persistence (state lost on refresh)
- No undo functionality
- Timer accuracy: ±1 second

### Future Enhancements (Post-MVP)
These are explicitly NOT in MVP but documented for future consideration:
- Multiple difficulty levels
- Custom grid size
- High score tracking (localStorage)
- Dark mode theme
- Sound effects toggle
- Mobile app wrapper (PWA)

---

## 12. Success Metrics

### Functional Completeness
- [ ] Can play and win a game
- [ ] Can play and lose a game
- [ ] First click never hits mine
- [ ] Flags work on right-click and long-press
- [ ] Timer and counter work correctly
- [ ] Restart resets game properly

### Quality Gates
- [ ] Test coverage > 80% for core logic
- [ ] No accessibility violations (axe-core)
- [ ] Lighthouse score > 90 (Performance, Accessibility, Best Practices)
- [ ] Works on mobile (iOS Safari, Android Chrome)

### Deployment Success
- [ ] Publicly accessible URL works
- [ ] No console errors on production
- [ ] Assets load correctly (no 404s)

---

## 13. Principles & Philosophy

### Core Values
1. **Simplicity**: Prefer simple solutions over clever ones
2. **Clarity**: Code should be self-documenting
3. **Testability**: Write code that is easy to test
4. **Accessibility**: Build for everyone from the start
5. **Performance**: Fast by default, optimize only when needed

### Decision-Making Framework
When in doubt:
1. Does it serve the MVP goal?
2. Is it the simplest solution that works?
3. Can it be tested?
4. Is it accessible?
5. Will it ship on time?

If answer is "no" to any, reconsider the approach.

---

## 14. Constraints & Trade-offs

### Accepted Trade-offs
- **No animations**: Faster load, simpler code
- **Single difficulty**: Faster MVP, easier testing
- **No backend**: Simpler deployment, no server costs
- **CSS Modules only**: Smaller bundle, no framework lock-in

### Non-Negotiable Requirements
- **Accessibility**: Keyboard navigation and ARIA must work
- **First-click safety**: First click must never reveal a mine
- **Mobile support**: Must work on touch devices
- **GitHub Pages**: Must deploy successfully

---

**End of Constitution**

*This document serves as the guiding principles for the Minesweeper Minimal project. All implementation decisions should align with these standards. When conflicts arise, refer back to this constitution for resolution.*
