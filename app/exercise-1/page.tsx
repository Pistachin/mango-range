import Link from 'next/link';
import Exercise1Client from './_components/Exercise1Client';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';

export default async function Exercise1() {
  const values = await fetch(`${baseURL}/api/min-max`).then((res) => res.json());
  return (
    <div className="flex flex-col">
      <h1>Exercise 1</h1>
      <Exercise1Client values={values} />
      <div className="mt-4 flex justify-between">
        <Link href="/" className="text-blue-500 underline">
          Go back to home
        </Link>
        <Link href="/exercise-2" className="ml-4 text-blue-500 underline">
          Go to exercise 2
        </Link>
      </div>
    </div>
  );
}
