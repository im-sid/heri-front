'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { useFloatingMenu } from '@/hooks/useFloatingMenu';
import { 
  Menu, 
  X, 
  Zap, 
  Image as ImageIcon, 
  Sparkles, 
  MessageCircle,
  Shield,
  User,
  Home,
  ChevronRight
} from 'lucide-react';

const FloatingMenu = () => {
  const { user, userProfile } = useAuth();
  const pathname = usePathname();
  const { isOpen, toggleMenu, closeMenu } = useFloatingMenu();

  const menuItems = [
    {
      href: '/',
      icon: Home,
      label: 'Home',
      color: 'text-blue-400',
      description: 'Back to homepage'
    },
    {
      href: '/chatbot',
      icon: Zap,
      label: 'AI Lab',
      color: 'text-primary',
      description: 'Image enhancement & analysis'
    },
    {
      href: '/gallery',
      icon: ImageIcon,
      label: 'Gallery',
      color: 'text-secondary',
      description: 'Your processed images'
    },
    {
      href: '/scifi-writer',
      icon: Sparkles,
      label: 'Sci-Fi Mode',
      color: 'text-purple-400',
      description: 'Creative story generation'
    },
    {
      href: '/gemini-chat',
      icon: MessageCircle,
      label: 'Gemini Chat',
      color: 'text-green-400',
      description: 'Direct AI conversation'
    }
  ];

  // Add admin item if user is admin
  if (userProfile?.role === 'admin') {
    menuItems.push({
      href: '/admin',
      icon: Shield,
      label: 'Admin',
      color: 'text-red-400',
      description: 'Admin dashboard'
    });
  }

  // Add profile item
  if (user) {
    menuItems.push({
      href: '/profile',
      icon: User,
      label: 'Profile',
      color: 'text-cyan-400',
      description: 'Your account settings'
    });
  }

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Floating Menu Button */}
      <div className="fixed top-20 left-4 z-40">
        <button
          onClick={toggleMenu}
          className={`
            floating-menu-button
            w-12 h-12 sm:w-14 sm:h-14 
            glass-effect 
            border-2 border-primary/50 
            rounded-full 
            flex items-center justify-center 
            transition-all duration-300 
            hover:border-primary 
            hover:shadow-glow-lg 
            group
            ${isOpen ? 'bg-primary/20 border-primary menu-item-glow' : 'hover:bg-primary/10 floating-button-hover'}
          `}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-primary transition-transform duration-300 rotate-90" />
          ) : (
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-primary transition-transform duration-300 group-hover:scale-110" />
          )}
          
          {/* Notification Badge */}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse">
              <div className="absolute inset-0 bg-secondary rounded-full animate-ping"></div>
            </div>
          )}
        </button>
      </div>

      {/* Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-dark/50 menu-backdrop"
          onClick={closeMenu}
        />
      )}

      {/* Sliding Menu Panel */}
      <div className={`
        floating-menu-panel
        fixed top-0 left-0 h-full w-80 sm:w-96 z-35
        glass-effect border-r-2 border-primary/30
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 floating-menu-enter' : '-translate-x-full floating-menu-exit'}
      `}>
        {/* Menu Header */}
        <div className="p-6 border-b border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-glow-copper">
                Quick Access
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Navigate to any feature
              </p>
            </div>
            <button
              onClick={closeMenu}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-primary" />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-120px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`
                  group flex items-center p-4 rounded-lg 
                  menu-item-hover
                  ${active 
                    ? 'menu-item-active' 
                    : 'hover:bg-primary/10 border-2 border-transparent hover:border-primary/30'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 sm:w-12 sm:h-12 
                  rounded-full 
                  flex items-center justify-center 
                  transition-all duration-300
                  ${active 
                    ? 'bg-primary/30 shadow-glow' 
                    : 'bg-dark/50 group-hover:bg-primary/20'
                  }
                `}>
                  <Icon className={`
                    w-5 h-5 sm:w-6 sm:h-6 
                    transition-all duration-300
                    ${active ? 'text-primary' : `${item.color} group-hover:text-primary`}
                  `} />
                </div>
                
                <div className="ml-4 flex-1">
                  <h3 className={`
                    font-semibold text-sm sm:text-base transition-colors duration-300
                    ${active ? 'text-primary' : 'text-white group-hover:text-primary'}
                  `}>
                    {item.label}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.description}
                  </p>
                </div>
                
                <ChevronRight className={`
                  w-4 h-4 transition-all duration-300
                  ${active 
                    ? 'text-primary translate-x-1' 
                    : 'text-gray-500 group-hover:text-primary group-hover:translate-x-1'
                  }
                `} />
              </Link>
            );
          })}
        </div>

        {/* Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary/20 bg-dark/80">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <span>Press</span>
              <kbd className="px-2 py-1 bg-dark border border-gray-600 rounded text-xs">Esc</kbd>
              <span>to close</span>
            </div>
            <p className="text-xs text-gray-500">
              Heri-Science AI Platform
            </p>
            <p className="text-xs text-primary">
              {user ? `Welcome, ${userProfile?.displayName || user.email?.split('@')[0]}` : 'Please login to continue'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingMenu;