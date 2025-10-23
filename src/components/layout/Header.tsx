'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { logoutUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Search, LogOut, User, Shield, Sparkles, Image as ImageIcon } from 'lucide-react';

const Header = () => {
  const { user, userProfile } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-primary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Search className="w-8 h-8 text-primary group-hover:text-secondary transition-colors duration-300 animate-float" />
              <div className="absolute inset-0 blur-lg bg-primary/50 group-hover:bg-secondary/50 transition-colors duration-300"></div>
            </div>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-glow">
                Heri-Science
              </h1>
              <p className="font-sans text-[10px] text-primary tracking-wider">
                ANCIENT MEETS AI
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {user ? (
              <>
                  <Link
                    href="/chatbot"
                    className="hidden sm:block font-sans text-sm hover:text-primary transition-colors duration-300"
                  >
                    AI Lab
                  </Link>
                  
                  <Link
                    href="/gallery"
                    className="hidden sm:flex items-center space-x-1 font-sans text-sm hover:text-secondary transition-colors duration-300"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Gallery</span>
                  </Link>
                  
                  <Link
                    href="/scifi-writer"
                    className="hidden sm:flex items-center space-x-1 font-sans text-sm hover:text-secondary transition-colors duration-300"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Sci-Fi Mode</span>
                  </Link>
                  
                  <Link
                    href="/gemini-chat"
                    className="hidden sm:flex items-center space-x-1 font-sans text-sm hover:text-green-400 transition-colors duration-300"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini Chat</span>
                  </Link>
                
                {userProfile?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="hidden sm:flex items-center space-x-1 font-sans text-sm hover:text-primary transition-colors duration-300"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}

                <Link
                  href="/profile"
                  className="flex items-center space-x-2 glass-effect px-3 py-2 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors duration-300"
                >
                  <User className="w-4 h-4 text-primary" />
                  <span className="hidden sm:block font-sans text-sm">
                    {userProfile?.displayName || user.email}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-lg transition-all duration-300 border-glow group"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:block font-sans text-sm">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-sans text-sm hover:text-primary transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-lg transition-all duration-300 border-glow font-sans text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;


