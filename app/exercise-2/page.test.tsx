import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';
import Exercise2 from './page';

vi.mock('next/dist/client/link', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Exercise2 page', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches fixed values from the API and renders in fixed mode', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: async () => [10, 50, 100],
    } as Response);

    render(await Exercise2());

    expect(screen.getByText('10 €')).toBeInTheDocument();
    expect(screen.getByText('100 €')).toBeInTheDocument();
    expect(screen.queryAllByRole('spinbutton')).toHaveLength(0);
  });
});
