'use client';
import Range from '@/app/_components/Range';
import { useState } from 'react';

interface Exercise2ClientProps {
  values: number[];
}

export default function Exercise2Client({ values }: Exercise2ClientProps) {
  const [userMin, setUserMin] = useState(values[0]);
  const [userMax, setUserMax] = useState(values[values.length - 1]);
  const handleChange = (values: { userMin: number; userMax: number }) => {
    setUserMin(values.userMin);
    setUserMax(values.userMax);
  };

  return (
    <Range
      settingsMin={values[0]}
      settingsMax={values[values.length - 1]}
      type="fixed"
      fixedValues={values}
      onChange={handleChange}
      userMin={userMin}
      userMax={userMax}
    />
  );
}
