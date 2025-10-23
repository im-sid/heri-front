'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import GeminiChatInterface from '@/components/chatbot/GeminiChatInterface';
import { Loader } from 'lucide-react';

const GeminiChatContent = () => {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get('imageUrl');
  const processingType = searchParams.get('processingType') as 'super-resolution' | 'restoration' | undefined;
  const sessionName = searchParams.get('sessionName');

  return (
    <GeminiChatInterface 
      imageUrl={imageUrl || undefined}
      processingType={processingType}
      sessionName={sessionName || undefined}
    />
  );
};

const GeminiChatPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <Loader className="w-12 h-12 animate-spin text-primary" />
      </div>
    }>
      <GeminiChatContent />
    </Suspense>
  );
};

export default GeminiChatPage;