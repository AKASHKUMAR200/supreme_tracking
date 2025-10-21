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
      <body className="font-serif antialiased min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
        <div className="min-h-screen relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
