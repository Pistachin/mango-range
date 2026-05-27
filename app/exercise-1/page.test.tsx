import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';
import Exercise1 from './page';

vi.mock('next/link', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Exercise1 page', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches min/max from the API and passes it to the range', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => ({ min: 5, max: 95 }),
    } as Response);

    render(await Exercise1());

    expect(screen.getByRole('spinbutton', { name: 'Minimum value' })).toHaveValue('5');
    expect(screen.getByRole('spinbutton', { name: 'Maximum value' })).toHaveValue('95');
  });
});
