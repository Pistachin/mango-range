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

  const toPercent = (value: number) => {
    return ((value - settingsMin) / (settingsMax - settingsMin)) * 100;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, target: 'min' | 'max') => {
    const current = target === 'min' ? userMin : userMax;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setValueManually(current + step, target);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setValueManually(current - step, target);
    }
  };

  const percentToValue = (clientX: number) => {
    const rect = rangeRef.current!.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = settingsMin + ratio * (settingsMax - settingsMin);
    const decimalPlaces = step.toString().split('.')[1]?.length || 0;
    return parseFloat(rawValue.toFixed(decimalPlaces));
  };

  useEffect(() => {
    userMinRef.current = userMin;
    userMaxRef.current = userMax;
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragTarget.current) return;
      const newValue = percentToValue(e.clientX);
      onChange(
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
    <div className="px-2 py-4 min-w-[150px] w-full max-w-md flex items-center">
      {isFixed ? (
        <div>{userMin} €</div>
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
            onChange={(e) => setValueManually(Number(e.target.value), 'min')}
            onKeyDown={(e) => handleKeyDown(e, 'min')}
            className={`${inputClass} text-end`}
          />{' '}
          €
        </>
      )}
      <div ref={rangeRef} className="relative h-1 bg-gray-200 rounded-full mx-3 flex-grow">
        <div
          className="absolute h-full bg-black rounded-full"
          style={{
            left: `${toPercent(userMin)}%`,
            width: `${toPercent(userMax) - toPercent(userMin)}%`,
          }}
        />
        <div
          className={draggableClass}
          style={{ left: `${toPercent(userMin)}%` }}
          onMouseDown={() => (dragTarget.current = 'min')}
        />
        <div
          className={draggableClass}
          style={{ left: `${toPercent(userMax)}%` }}
          onMouseDown={() => (dragTarget.current = 'max')}
        />
      </div>
      {isFixed ? (
        <div>{userMax} €</div>
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
            onChange={(e) => setValueManually(Number(e.target.value), 'max')}
            onKeyDown={(e) => handleKeyDown(e, 'max')}
            className={`${inputClass} text-start`}
          />{' '}
          €
        </>
      )}
    </div>
  );
}
