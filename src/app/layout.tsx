import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/Toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Heri-Science | Ancient Meets AI',
  description: 'A web platform that blends history and science to analyze, restore, and enhance ancient artifacts and monuments using AI.',
  keywords: 'archaeology, AI, artifact restoration, historical analysis, museum technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AuthProvider>
          <Toaster />
          <Header />
          <main className="flex-grow pt-16">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}


