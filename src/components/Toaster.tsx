'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1A1A1A',
          color: '#fff',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '8px',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
        },
        success: {
          iconTheme: {
            primary: '#8B5CF6',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}


