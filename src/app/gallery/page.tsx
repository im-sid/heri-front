'use client';

import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import GalleryPageContent from './GalleryPageContent';



const GalleryPage = () => {
  return (
    <ProtectedRoute>
      <GalleryPageContent />
    </ProtectedRoute>
  );
};

export default GalleryPage;


