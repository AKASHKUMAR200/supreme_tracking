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
      <body className="font-serif antialiased min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 relative">
        <div className="min-h-screen absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="traditionalPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M40 10 L50 20 L60 10 L70 20 L80 10 L70 0 L60 10 L50 0 L40 10 Z M0 30 L10 40 L20 30 L30 40 L40 30 L30 20 L20 30 L10 20 L0 30 Z M60 50 L70 60 L80 50 L70 40 L60 50 Z M20 70 L30 80 L40 70 L30 60 L20 70 Z" fill="#F59E0B"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#traditionalPattern)"/>
          </svg>
        </div>
        <div className="min-h-screen relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
