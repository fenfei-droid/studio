import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { BackgroundMusic } from '@/components/game/background-music';

export const metadata: Metadata = {
  title: 'The Ward: Eyeless Escape',
  description: 'A Choose Your Own Adventure horror game.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Literata:opsz@6..72&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <BackgroundMusic />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
