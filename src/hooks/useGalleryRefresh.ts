import { useCallback } from 'react';

// Global event system for gallery refresh
const GALLERY_REFRESH_EVENT = 'gallery-refresh';

export const useGalleryRefresh = () => {
  const triggerRefresh = useCallback(() => {
    // Dispatch custom event to notify gallery to refresh
    window.dispatchEvent(new CustomEvent(GALLERY_REFRESH_EVENT));
  }, []);

  const onRefreshRequested = useCallback((callback: () => void) => {
    const handleRefresh = () => {
      callback();
    };

    window.addEventListener(GALLERY_REFRESH_EVENT, handleRefresh);
    
    return () => {
      window.removeEventListener(GALLERY_REFRESH_EVENT, handleRefresh);
    };
  }, []);

  return {
    triggerRefresh,
    onRefreshRequested
  };
};