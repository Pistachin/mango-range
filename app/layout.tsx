import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Range Input Test',
  description: 'Created by Santiago Arcos to showcase React and Next.js skills',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const mainStyles =
    'flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-16 px-16 bg-white sm:items-start';
  // const mainStyles =
  //   'flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start';

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col justify-center items-center">
        <main className={mainStyles}>{children}</main>
      </body>
    </html>
  );
}
