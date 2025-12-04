# Minesweeper Minimal 💣

A minimalist implementation of the classic Minesweeper game, built with modern web technologies following specification-driven development methodology.

🎮 **[Play Live Demo](https://waldekswo.github.io/Arena2Ex4/)**

## Features

✅ Classic 9×9 grid with 10 mines  
✅ First-click safety (guaranteed safe start)  
✅ Smart flood-fill algorithm for empty cells  
✅ Mine counter and timer  
✅ Flag suspicious cells (right-click)  
✅ Win/lose detection  
✅ Responsive design (mobile, tablet, desktop)  
✅ Touch-friendly controls  
✅ Accessibility features (ARIA labels, keyboard navigation)  
✅ Retro-inspired 3D visual design  

## Tech Stack

- **React 19.2.1** - UI library with functional components and hooks
- **TypeScript 5.9.3** - Type-safe development with strict mode
- **Vite 7.2.6** - Lightning-fast build tool and dev server
- **Vitest 4.0.15** - Modern unit testing framework
- **CSS Modules** - Scoped styling with zero runtime overhead
- **GitHub Pages** - Static site hosting
- **Spec-kit** - Specification-driven development toolkit

## Game Rules

1. **Goal**: Reveal all cells that don't contain mines
2. **Left Click**: Reveal a cell
3. **Right Click**: Flag/unflag a cell as a mine
4. **Numbers**: Show how many mines are adjacent (1-8)
5. **Empty Cells**: Automatically reveal connected empty areas
6. **First Click**: Always safe - never hits a mine
7. **Win**: Reveal all non-mine cells
8. **Lose**: Click on a mine

## Project Structure

```
my-app/
├── src/
│   ├── components/       # React components
│   │   ├── Cell.tsx      # Individual cell component
│   │   ├── Board.tsx     # 9×9 game board
│   │   └── Hud.tsx       # Header with counter, timer, reset
│   ├── hooks/
│   │   └── useMinesweeper.ts  # Main game logic hook
│   ├── lib/              # Core algorithms
│   │   ├── types.ts      # TypeScript interfaces & enums
│   │   ├── generator.ts  # Board generation algorithm
│   │   └── floodFill.ts  # Cell reveal algorithm (BFS)
│   ├── styles/           # CSS Modules
│   │   ├── Cell.module.css
│   │   ├── Board.module.css
│   │   └── Hud.module.css
│   └── App.tsx           # Main application component
├── specs/                # Specification documents
│   └── 001-minesweeper-game/
│       ├── CONSTITUTION.md  # Project principles
│       ├── SPEC.md          # Technical specification
│       ├── PLAN.md          # Implementation plan
│       └── TASKS.md         # Task breakdown
└── tests/                # Unit tests
    ├── generator.test.ts
    ├── floodFill.test.ts
    └── App.test.tsx
```

## Local Development

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/waldekswo/Arena2Ex4.git
cd Arena2Ex4/my-app

# Install dependencies
npm install
```

### Development Commands

```bash
# Start development server (http://localhost:5173)
npm run dev

# Run tests
npm run test

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## Deployment

The app is automatically deployed to GitHub Pages via GitHub Actions on every push to `main` branch.

**Live URL**: https://waldekswo.github.io/Arena2Ex4/

### Manual Deployment

```bash
npm run deploy
```

This will:
1. Build the production bundle
2. Push to `gh-pages` branch
3. Deploy to GitHub Pages

## Testing

Test coverage: **15 tests, 100% passing**

- **Generator Tests** (8): Board generation, mine placement, first-click safety
- **Flood Fill Tests** (5): BFS algorithm, empty cell reveals
- **Component Tests** (2): React component rendering

Run tests:
```bash
npm run test:run
```

## Architecture Decisions

### First-Click Safety
The board is generated only after the first click, ensuring the clicked cell and its neighbors are mine-free.

### Flood Fill Algorithm
Uses iterative BFS (Breadth-First Search) to efficiently reveal connected empty cells, preventing stack overflow.

### State Management
Custom React hook (`useMinesweeper`) manages all game state with immutable updates for predictable behavior.

### Styling
CSS Modules provide scoped styles with zero runtime overhead, supporting responsive design and accessibility.

## Performance

- **Bundle Size**: 199 kB raw → 63 kB gzipped
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 1.5s
- **Lighthouse Score**: 100/100

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - See [LICENSE](LICENSE) for details

## Acknowledgments

- Built following [Spec-kit](https://github.com/github/spec-kit) methodology
- Inspired by classic Windows Minesweeper
- Icons: Emoji (🚩💣⏱️)

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Follow existing code style
4. Add tests for new features
5. Submit a pull request

## Support

For issues or questions, please [open an issue](https://github.com/waldekswo/Arena2Ex4/issues) on GitHub.
