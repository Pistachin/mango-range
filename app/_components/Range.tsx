'use client';
import { useRef, useEffect } from 'react';

interface RangeProps {
  settingsMin: number;
  settingsMax: number;
  userMin: number;
  userMax: number;
  type: 'free' | 'fixed';
  onChange: (values: { userMin: number; userMax: number }) => void;
  fixedValues?: number[];
  step?: number;
}

export default function Range({
  settingsMin = 0,
  settingsMax = 100,
  userMin = 0,
  userMax = 100,
  type,
  fixedValues,
  step = 1,
  onChange,
}: RangeProps) {
  const isFixed = type === 'fixed';
  const rangeRef = useRef<HTMLDivElement>(null);
  const dragTarget = useRef<'min' | 'max' | null>(null);
  const userMinRef = useRef(userMin);
  const userMaxRef = useRef(userMax);
  const onChangeRef = useRef(onChange);
  const useFixed = isFixed && fixedValues && fixedValues.length > 1;

  const inputClass = 'w-10 p-1 focus:outline-none';
  const draggableClass =
    'absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 top-1/2 rounded-full bg-black border-2 border-black cursor-grab hover:w-5 hover:h-5';

  const setValueManually = (value: number, target: 'min' | 'max') => {
    if (typeof value !== 'number' || isNaN(value)) return;
    if (value < settingsMin || value > settingsMax) return;

    if (target === 'min') {
      onChange({ userMin: Math.min(value, userMax), userMax });
    }
    if (target === 'max') {
      onChange({ userMin, userMax: Math.max(value, userMin) });
    }
  };

  const valueToPercent = (value: number) => {
    if (useFixed) {
      const index = fixedValues!.indexOf(value);
      if (index !== -1) {
        return (index / (fixedValues.length - 1)) * 100;
      }
    }

    return ((value - settingsMin) / (settingsMax - settingsMin)) * 100;
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, target: 'min' | 'max') => {
    const current = target === 'min' ? userMin : userMax;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setValueManually(current + step, target);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setValueManually(current - step, target);
    }
  };

  const handleSliderKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, target: 'min' | 'max') => {
    const current = target === 'min' ? userMin : userMax;
    if (useFixed) {
      const currentIndex = fixedValues!.indexOf(current);
      if (e.key === 'ArrowRight' && currentIndex < fixedValues!.length - 1) {
        e.preventDefault();
        setValueManually(fixedValues![currentIndex + 1], target);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        setValueManually(fixedValues![currentIndex - 1], target);
      }
      return;
    }
  };

  const percentToValue = (clientX: number) => {
    const rect = rangeRef.current!.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));

    if (useFixed) {
      const index = Math.round(ratio * (fixedValues!.length - 1));
      return fixedValues![index];
    }
    const rawValue = settingsMin + ratio * (settingsMax - settingsMin);
    const decimalPlaces = step.toString().split('.')[1]?.length || 0;
    return parseFloat(rawValue.toFixed(decimalPlaces));
  };

  useEffect(() => {
    userMinRef.current = userMin;
    userMaxRef.current = userMax;
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragTarget.current) return;
      const newValue = percentToValue(e.clientX);
      onChangeRef.current(
        dragTarget.current === 'min'
          ? { userMin: Math.min(newValue, userMaxRef.current), userMax: userMaxRef.current }
          : { userMin: userMinRef.current, userMax: Math.max(newValue, userMinRef.current) }
      );
    };
    const handleMouseUp = () => {
      dragTarget.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="px-2 py-4 min-w-[300px] w-full max-w-md flex items-center">
      {isFixed ? (
        <div className="p-1">{userMin} €</div>
      ) : (
        <>
          <input
            type="text"
            inputMode="decimal"
            value={userMin}
            role="spinbutton"
            aria-valuenow={userMin}
            aria-valuemin={settingsMin}
            aria-valuemax={settingsMax}
            aria-label="Minimum value"
            id="min-input"
            onChange={(e) => setValueManually(Number(e.target.value), 'min')}
            onKeyDown={(e) => handleInputKeyDown(e, 'min')}
            className={`${inputClass} text-end`}
          />{' '}
          €
        </>
      )}
      <div ref={rangeRef} className="relative h-1 bg-gray-200 rounded-full mx-3 flex-grow">
        <div
          className="absolute h-full bg-black rounded-full"
          data-testid="filled-track"
          style={{
            left: `${valueToPercent(userMin)}%`,
            width: `${valueToPercent(userMax) - valueToPercent(userMin)}%`,
          }}
        />
        <div
          className={draggableClass}
          data-testid="min-handle"
          role="slider"
          aria-valuenow={userMin}
          aria-valuemin={settingsMin}
          aria-valuemax={settingsMax}
          aria-hidden={!useFixed}
          aria-label="Minimum value"
          tabIndex={useFixed ? 0 : -1}
          onKeyDown={(e) => handleSliderKeyDown(e, 'min')}
          style={{ left: `${valueToPercent(userMin)}%` }}
          onMouseDown={() => (dragTarget.current = 'min')}
        />
        <div
          className={draggableClass}
          data-testid="max-handle"
          role="slider"
          aria-valuenow={userMax}
          aria-valuemin={settingsMin}
          aria-valuemax={settingsMax}
          aria-hidden={!useFixed}
          aria-label="Maximum value"
          tabIndex={useFixed ? 0 : -1}
          onKeyDown={(e) => handleSliderKeyDown(e, 'max')}
          style={{ left: `${valueToPercent(userMax)}%` }}
          onMouseDown={() => (dragTarget.current = 'max')}
        />
      </div>
      {isFixed ? (
        <div className="p-1">{userMax} €</div>
      ) : (
        <>
          <input
            type="text"
            inputMode="decimal"
            value={userMax}
            role="spinbutton"
            aria-valuenow={userMax}
            aria-valuemin={settingsMin}
            aria-valuemax={settingsMax}
            aria-label="Maximum value"
            id="max-input"
            onChange={(e) => setValueManually(Number(e.target.value), 'max')}
            onKeyDown={(e) => handleInputKeyDown(e, 'max')}
            className={`${inputClass} text-start`}
          />{' '}
          €
        </>
      )}
    </div>
  );
}
