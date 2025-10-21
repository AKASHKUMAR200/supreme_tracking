import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Supreme Temple Jewellery Tracker',
  description: 'Track your custom temple jewellery orders in real-time',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-serif antialiased">
        {children}
      </body>
    </html>
  );
}
