'use client';
import Range from '@/app/_components/Range';
import { useState } from 'react';

const MOCK_VALUES = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];

export default function Exercise2() {
  const [userMin, setUserMin] = useState(MOCK_VALUES[0]);
  const [userMax, setUserMax] = useState(MOCK_VALUES[MOCK_VALUES.length - 1]);
  const handleChange = (values: { userMin: number; userMax: number }) => {
    setUserMin(values.userMin);
    setUserMax(values.userMax);
  };

  return (
    <div>
      <h1>Exercise 2</h1>
      <Range
        settingsMin={MOCK_VALUES[0]}
        settingsMax={MOCK_VALUES[MOCK_VALUES.length - 1]}
        type="fixed"
        fixedValues={MOCK_VALUES}
        onChange={handleChange}
        userMin={userMin}
        userMax={userMax}
      />
    </div>
  );
}
