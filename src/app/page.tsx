import React from 'react';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import AboutSection from '@/components/home/AboutSection';

export default function Home() {
  return (
    <main className="min-h-screen" role="main">
      <Hero />
      <Features />
      <AboutSection />
    </main>
  );
}


