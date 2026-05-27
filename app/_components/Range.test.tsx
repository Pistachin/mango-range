import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Range from './Range';

const defaultProps = {
  settingsMin: 0,
  settingsMax: 100,
  userMin: 20,
  userMax: 80,
  type: 'free' as const,
  onChange: vi.fn(),
};

describe('Range', () => {
  it('renders without crashing', () => {
    render(<Range {...defaultProps} />);
    expect(screen.getByRole('spinbutton', { name: 'Minimum value' })).toBeInTheDocument();
  });

  describe('Rendering', () => {
    it('renders min and max inputs in free mode', () => {
      render(<Range {...defaultProps} />);
      const inputs = screen.getAllByRole('spinbutton');
      expect(inputs).toHaveLength(2);
      expect(inputs[0]).toHaveValue('20');
      expect(inputs[1]).toHaveValue('80');
    });

    it('renders text labels instead of inputs in fixed mode', () => {
      render(<Range {...defaultProps} type="fixed" fixedValues={[10, 20, 50, 80, 100]} />);
      expect(screen.queryAllByRole('spinbutton')).toHaveLength(0);
      expect(screen.getByText('20 €')).toBeInTheDocument();
      expect(screen.getByText('80 €')).toBeInTheDocument();
    });

    it('renders the filled track at the correct relative position', () => {
      render(<Range {...defaultProps} />);
      // userMin=20, userMax=80 on a 0–100 range → left: 20%, width: 60%
      const track = screen.getByTestId('filled-track') as HTMLElement;
      expect(track.style.left).toBe('20%');
      expect(track.style.width).toBe('60%');
    });
  });
});
