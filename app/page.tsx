import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      <h1>Here you can navigate to the exercises</h1>
      <div className="flex justify-evenly w-full max-w-md mt-4">
        <Link
          href="/exercise-1"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Exercise 1
        </Link>
        <Link
          href="/exercise-2"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Exercise 2
        </Link>
      </div>
    </div>
  );
}
