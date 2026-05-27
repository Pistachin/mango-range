import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import Range from './Range';
import type { ComponentProps } from 'react';

function ControlledRange({ onChange, ...props }: ComponentProps<typeof Range>) {
  const [values, setValues] = React.useState({ userMin: props.userMin, userMax: props.userMax });
  return (
    <Range
      {...props}
      {...values}
      onChange={(newValues) => {
        setValues(newValues);
        onChange(newValues);
      }}
    />
  );
}

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

  describe('Keyboard input change', () => {
    it('ArrowUp on the min input increments by step', async () => {
      const onChange = vi.fn();
      render(<Range {...defaultProps} onChange={onChange} />);
      screen.getByRole('spinbutton', { name: 'Minimum value' }).focus();
      await userEvent.keyboard('{ArrowUp}');
      expect(onChange).toHaveBeenCalledWith({ userMin: 21, userMax: 80 });
    });

    it('ArrowDown on the min input decrements by step', async () => {
      const onChange = vi.fn();
      render(<Range {...defaultProps} onChange={onChange} />);
      screen.getByRole('spinbutton', { name: 'Minimum value' }).focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(onChange).toHaveBeenCalledWith({ userMin: 19, userMax: 80 });
    });

    it('ArrowUp on the max input increments by step', async () => {
      const onChange = vi.fn();
      render(<Range {...defaultProps} onChange={onChange} />);
      screen.getByRole('spinbutton', { name: 'Maximum value' }).focus();
      await userEvent.keyboard('{ArrowUp}');
      expect(onChange).toHaveBeenCalledWith({ userMin: 20, userMax: 81 });
    });

    it('ArrowDown on the max input decrements by step', async () => {
      const onChange = vi.fn();
      render(<Range {...defaultProps} onChange={onChange} />);
      screen.getByRole('spinbutton', { name: 'Maximum value' }).focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(onChange).toHaveBeenCalledWith({ userMin: 20, userMax: 79 });
    });

    it('does not step the min below settingsMin', async () => {
      const onChange = vi.fn();
      render(<Range {...defaultProps} userMin={0} onChange={onChange} />);
      screen.getByRole('spinbutton', { name: 'Minimum value' }).focus();
      await userEvent.keyboard('{ArrowDown}');
      expect(onChange).not.toHaveBeenCalled();
    });

    it('does not step the max above settingsMax', async () => {
      const onChange = vi.fn();
      render(<Range {...defaultProps} userMax={100} onChange={onChange} />);
      screen.getByRole('spinbutton', { name: 'Maximum value' }).focus();
      await userEvent.keyboard('{ArrowUp}');
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('Drag interaction', () => {
    it('calls onChange when the min handle is dragged', () => {
      const onChange = vi.fn();
      render(<Range {...defaultProps} onChange={onChange} />);

      // jsdom returns zero dimensions; mock to get predictable percentToValue results
      const trackContainer = screen.getByTestId('filled-track').parentElement!;
      vi.spyOn(trackContainer, 'getBoundingClientRect').mockReturnValue({
        left: 0,
        width: 200,
        top: 0,
        bottom: 0,
        right: 200,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      // handles are aria-hidden in free mode, so query with { hidden: true }
      const minHandle = screen.getByTestId('min-handle');
      fireEvent.mouseDown(minHandle);
      fireEvent.mouseMove(window, { clientX: 50 }); // 50/200 = 25% → value 25
      fireEvent.mouseUp(window);

      expect(onChange).toHaveBeenCalledWith({ userMin: 25, userMax: 80 });
    });
  });

  describe('Fixed mode keyboard navigation', () => {
    const fixedProps = {
      ...defaultProps,
      type: 'fixed' as const,
      fixedValues: [10, 20, 50, 80, 100],
    };

    it('ArrowRight on the min handle advances to the next fixed value', async () => {
      const onChange = vi.fn();
      render(<Range {...fixedProps} onChange={onChange} />);
      screen.getByTestId('min-handle').focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(onChange).toHaveBeenCalledWith({ userMin: 50, userMax: 80 });
    });

    it('ArrowLeft on the min handle does nothing when already at the first fixed value', async () => {
      const onChange = vi.fn();
      render(<Range {...fixedProps} userMin={10} onChange={onChange} />);
      screen.getByTestId('min-handle').focus();
      await userEvent.keyboard('{ArrowLeft}');
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});

describe('ControlledRange', () => {
  describe('Input editing when mode is free', () => {
    it('calls onChange with the new value when the user types in the min input', async () => {
      const onChange = vi.fn();
      render(<ControlledRange {...defaultProps} onChange={onChange} />);
      const minInput = screen.getByRole('spinbutton', { name: 'Minimum value' });
      await userEvent.clear(minInput);
      await userEvent.type(minInput, '30');
      expect(onChange).toHaveBeenLastCalledWith({ userMin: 30, userMax: 80 });
    });

    it('ignores values outside the settingsMin/settingsMax bounds', async () => {
      const onChange = vi.fn();
      render(<ControlledRange {...defaultProps} onChange={onChange} />);
      const minInput = screen.getByRole('spinbutton', { name: 'Minimum value' });
      fireEvent.change(minInput, { target: { value: '150' } });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('clamps typed min value to userMax when it would exceed it', async () => {
      const onChange = vi.fn();
      render(<ControlledRange {...defaultProps} onChange={onChange} />);
      const minInput = screen.getByRole('spinbutton', { name: 'Minimum value' });
      await userEvent.clear(minInput);
      await userEvent.type(minInput, '90');
      expect(onChange).toHaveBeenLastCalledWith({ userMin: 80, userMax: 80 });
    });

    it('clamps typed max value to userMin when it would go below it', async () => {
      const onChange = vi.fn();
      render(<ControlledRange {...defaultProps} onChange={onChange} />);
      const maxInput = screen.getByRole('spinbutton', { name: 'Maximum value' });
      await userEvent.clear(maxInput);
      await userEvent.type(maxInput, '10');
      expect(onChange).toHaveBeenLastCalledWith({ userMin: 20, userMax: 20 });
    });
  });
});

describe('ControlledRange', () => {
  describe('Input editing when mode is free', () => {
    it('calls onChange with the new value when the user types in the min input', async () => {
      const onChange = vi.fn();
      render(<ControlledRange {...defaultProps} onChange={onChange} />);
      const minInput = screen.getByRole('spinbutton', { name: 'Minimum value' });
      await userEvent.clear(minInput);
      await userEvent.type(minInput, '30');
      expect(onChange).toHaveBeenLastCalledWith({ userMin: 30, userMax: 80 });
    });

    it('ignores values outside the settingsMin/settingsMax bounds', async () => {
      const onChange = vi.fn();
      render(<ControlledRange {...defaultProps} onChange={onChange} />);
      const minInput = screen.getByRole('spinbutton', { name: 'Minimum value' });
      fireEvent.change(minInput, { target: { value: '150' } });
      expect(onChange).not.toHaveBeenCalled();
    });

    it('clamps typed min value to userMax when it would exceed it', async () => {
      const onChange = vi.fn();
      render(<ControlledRange {...defaultProps} onChange={onChange} />);
      const minInput = screen.getByRole('spinbutton', { name: 'Minimum value' });
      await userEvent.clear(minInput);
      await userEvent.type(minInput, '90');
      expect(onChange).toHaveBeenLastCalledWith({ userMin: 80, userMax: 80 });
    });

    it('clamps typed max value to userMin when it would go below it', async () => {
      const onChange = vi.fn();
      render(<ControlledRange {...defaultProps} onChange={onChange} />);
      const maxInput = screen.getByRole('spinbutton', { name: 'Maximum value' });
      await userEvent.clear(maxInput);
      await userEvent.type(maxInput, '10');
      expect(onChange).toHaveBeenLastCalledWith({ userMin: 20, userMax: 20 });
    });
  });
});
