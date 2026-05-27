import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Exercise2Client from './Exercise2Client';

describe('Exercise2Client', () => {
  it('derives settingsMin and settingsMax from the first and last values', () => {
    render(<Exercise2Client values={[200, 500, 1000]} />);
    expect(screen.getByText('200 €')).toBeInTheDocument();
    expect(screen.getByText('1000 €')).toBeInTheDocument();
  });
});
