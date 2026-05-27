import Exercise1Client from './_components/Exercise1Client';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';

export default async function Exercise1() {
  const values = await fetch(`${baseURL}/api/min-max`).then((res) => res.json());
  return (
    <div>
      <h1>Exercise 1</h1>
      <Exercise1Client values={values} />
    </div>
  );
}
