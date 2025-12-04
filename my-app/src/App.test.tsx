import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the app title', () => {
    render(<App />);
    const title = screen.getByText(/Minesweeper Minimal/i);
    expect(title).toBeInTheDocument();
  });

  it('renders the placeholder text', () => {
    render(<App />);
    const placeholder = screen.getByText(/Game will be implemented here/i);
    expect(placeholder).toBeInTheDocument();
  });
});
