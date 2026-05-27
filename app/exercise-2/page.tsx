import Link from 'next/dist/client/link';
import Exercise2Client from './_components/Exercise2Client';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';

export default async function Exercise2() {
  const values = await fetch(`${baseURL}/api/fixed-values`).then((res) => res.json());

  return (
    <div className="flex flex-col">
      <h1>Exercise 2</h1>
      <Exercise2Client values={values} />
      <div className="mt-4 flex justify-between">
        <Link href="/" className="text-blue-500 underline">
          Go back to home
        </Link>
        <Link href="/exercise-1" className="ml-4 text-blue-500 underline">
          Go to exercise 1
        </Link>
      </div>
    </div>
  );
}
