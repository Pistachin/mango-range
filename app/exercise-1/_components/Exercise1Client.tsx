'use client';
import { useState } from 'react';
import Range from '@/app/_components/Range';

interface Exercise1ClientProps {
  values: { min: number; max: number; step?: number };
}

export default function Exercise1Client({ values }: Exercise1ClientProps) {
  const [userMin, setUserMin] = useState(values.min);
  const [userMax, setUserMax] = useState(values.max);

  const handleChange = (values: { userMin: number; userMax: number }) => {
    setUserMin(values.userMin);
    setUserMax(values.userMax);
  };

  return (
    <Range
      settingsMin={values.min}
      settingsMax={values.max}
      type="free"
      onChange={handleChange}
      userMin={userMin}
      userMax={userMax}
      step={values.step || 1}
    />
  );
}
