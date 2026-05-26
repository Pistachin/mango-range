'use client';
import { useState } from 'react';
import Range from '@/app/_components/Range';

export default function Exercise1() {
  const [userMin, setUserMin] = useState(0);
  const [userMax, setUserMax] = useState(100);

  const handleChange = (values: { userMin: number; userMax: number }) => {
    setUserMin(values.userMin);
    setUserMax(values.userMax);
  };

  return (
    <div>
      <h1>Exercise 1</h1>
      <Range
        settingsMin={0}
        settingsMax={100}
        type="free"
        onChange={handleChange}
        userMin={userMin}
        userMax={userMax}
        step={1}
      />
    </div>
  );
}
