import Exercise2Client from './_components/Exercise2Client';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';

export default async function Exercise2() {
  const values = await fetch(`${baseURL}/api/fixed-values`).then((res) => res.json());

  return (
    <div>
      <h1>Exercise 2</h1>
      <Exercise2Client values={values} />
    </div>
  );
}
