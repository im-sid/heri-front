'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SciFiWriterInterface from '@/components/scifi/SciFiWriterInterface';
import { Loader } from 'lucide-react';

const SciFiWriterContent = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  return <SciFiWriterInterface sessionId={sessionId || undefined} />;
};

const SciFiWriterPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center ancient-glyph">
        <Loader className="w-12 h-12 animate-spin text-primary" />
      </div>
    }>
      <SciFiWriterContent />
    </Suspense>
  );
};

export default SciFiWriterPage;


