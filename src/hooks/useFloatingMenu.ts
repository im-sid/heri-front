import { useState, useEffect } from 'react';

export const useFloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    console.log('toggleMenu called, current state:', isOpen);
    setIsOpen(prev => !prev);
  };
  
  const closeMenu = () => {
    console.log('closeMenu called');
    setIsOpen(false);
  };
  
  const openMenu = () => {
    console.log('openMenu called');
    setIsOpen(true);
  };

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        console.log('Escape key pressed, closing menu');
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Debug effect
  useEffect(() => {
    console.log('Menu state changed to:', isOpen);
  }, [isOpen]);

  return {
    isOpen,
    toggleMenu,
    closeMenu,
    openMenu
  };
};