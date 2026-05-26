import Range from '@/app/_components/Range';

const MOCK_VALUES = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];

export default function Exercise2() {
  const handleChange = (values: { userMin: number; userMax: number }) => {
    console.log('Selected range:', values);
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
        userMin={MOCK_VALUES[0]}
        userMax={MOCK_VALUES[MOCK_VALUES.length - 1]}
      />
    </div>
  );
}
