import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the app title', () => {
    render(<App />);
    const title = screen.getByText(/Minesweeper Minimal/i);
    expect(title).toBeInTheDocument();
  });

  it('renders the game instructions', () => {
    render(<App />);
    const instructions = screen.getByText(/Left click to reveal/i);
    expect(instructions).toBeInTheDocument();
  });
});
