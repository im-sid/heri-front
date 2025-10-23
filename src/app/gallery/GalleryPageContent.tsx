'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProcessingSessions, ProcessingSession, deleteProcessingSession } from '@/lib/firestore';
import { getUserSciFiSessions, SciFiSession, deleteSciFiSession } from '@/lib/scifiFirestore';
import SessionCard from '@/components/gallery/SessionCard';
import SearchAndFilter from '@/components/gallery/SearchAndFilter';
import SessionModal from '@/components/gallery/SessionModal';
import ChatHistoryModal from '@/components/gallery/ChatHistoryModal';
import { RefreshCw, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useGalleryRefresh } from '@/hooks/useGalleryRefresh';
import '@/styles/responsive.css';

// Combined session type for gallery display
type GallerySession = (ProcessingSession & { sessionType: 'processing' }) | (SciFiSession & { sessionType: 'scifi' });

const GalleryPageContent = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { onRefreshRequested } = useGalleryRefresh();
  const [sessions, setSessions] = useState<GallerySession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<GallerySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'processing' | 'scifi'>('all');
  const [selectedSession, setSelectedSession] = useState<GallerySession | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [autoRefreshing, setAutoRefreshing] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, [user]);

  useEffect(() => {
    filterSessions();
  }, [searchTerm, filterType, sessions]);

  // Auto-refresh when page becomes visible (user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        // Only refresh if it's been more than 10 seconds since last fetch
        const now = Date.now();
        if (now - lastFetchTime > 10000) {
          fetchSessions(true, true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user, lastFetchTime]);

  // Periodic refresh every 30 seconds when page is active
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchSessions(false, true);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  // Listen for manual refresh requests from other components
  useEffect(() => {
    const cleanup = onRefreshRequested(() => {
      fetchSessions(true, false);
    });

    return cleanup;
  }, [onRefreshRequested]);

  const fetchSessions = async (showToast = false, isAutoRefresh = false) => {
    if (!user) return;
    
    if (isAutoRefresh) {
      setAutoRefreshing(true);
    }
    
    try {
      const previousCount = sessions.length;
      
      // Fetch both processing sessions and sci-fi sessions
      const [processingSessions, sciFiSessions] = await Promise.all([
        getUserProcessingSessions(user.uid),
        getUserSciFiSessions(user.uid)
      ]);
      
      // Combine and mark session types
      const combinedSessions: GallerySession[] = [
        ...processingSessions.map(session => ({ ...session, sessionType: 'processing' as const })),
        ...sciFiSessions.map(session => ({ ...session, sessionType: 'scifi' as const }))
      ];
      
      // Sort by updated date first, then creation date (newest first)
      combinedSessions.sort((a, b) => {
        const aTime = (a as any).updatedAt?.toMillis() || a.createdAt?.toMillis() || 0;
        const bTime = (b as any).updatedAt?.toMillis() || b.createdAt?.toMillis() || 0;
        return bTime - aTime;
      });
      
      // Check for new sessions
      const newSessionsCount = combinedSessions.length - previousCount;
      if (newSessionsCount > 0 && previousCount > 0 && showToast) {
        toast.success(`${newSessionsCount} new session${newSessionsCount > 1 ? 's' : ''} found!`);
      }
      
      setSessions(combinedSessions);
      setLastFetchTime(Date.now());
      
      console.log('Loaded sessions:', {
        processing: processingSessions.length,
        scifi: sciFiSessions.length,
        total: combinedSessions.length,
        new: newSessionsCount > 0 ? newSessionsCount : 0
      });
    } catch (error) {
      console.error('Error fetching sessions:', error);
      if (showToast) {
        toast.error('Failed to refresh gallery');
      }
    } finally {
      setLoading(false);
      if (isAutoRefresh) {
        setAutoRefreshing(false);
      }
    }
  };

  const filterSessions = () => {
    let filtered = sessions;

    // Filter by session type
    if (filterType === 'processing') {
      filtered = filtered.filter(session => session.sessionType === 'processing');
    } else if (filterType === 'scifi') {
      filtered = filtered.filter(session => session.sessionType === 'scifi');
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(s => {
        const name = s.sessionType === 'scifi' ? (s as any).title : (s as any).name;
        const description = (s as any).description || '';
        const tags = (s as any).tags || [];
        
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               description.toLowerCase().includes(searchTerm.toLowerCase()) ||
               tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      });
    }

    setFilteredSessions(filtered);
  };

  const handleDownload = (imageUrl: string, name: string) => {
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${name}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  const handleSessionClick = (session: GallerySession) => {
    if (session.sessionType === 'scifi') {
      // Redirect to sci-fi writer page with session ID
      router.push(`/scifi-writer?sessionId=${session.id}`);
    } else {
      // Show modal for processing sessions
      setSelectedSession(session);
    }
  };

  const handleDeleteSession = async (session: GallerySession, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const sessionName = session.sessionType === 'scifi' ? (session as any).title : (session as any).name;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${sessionName}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    const toastId = toast.loading('Deleting session...');
    
    try {
      if (session.sessionType === 'scifi') {
        await deleteSciFiSession(session.id!);
      } else {
        await deleteProcessingSession(session.id!);
      }
      
      // Remove from local state
      setSessions(prev => prev.filter(s => s.id !== session.id));
      toast.success('Session deleted successfully!', { id: toastId });
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session', { id: toastId });
    }
  };

  const handleContinueSession = (session: GallerySession, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (session.sessionType === 'scifi') {
      router.push(`/scifi-writer?sessionId=${session.id}`);
    } else {
      // Redirect to chatbot with session ID for AI Lab sessions
      router.push(`/chatbot?sessionId=${session.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ancient-glyph">
        <Loader className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen ancient-glyph stone-texture relative overflow-hidden py-4 sm:py-8">
      {/* Hindu Decorative Elements - Hidden on mobile */}
      <div className="hidden sm:block absolute top-10 right-10 text-4xl lg:text-6xl opacity-10 animate-float text-primary">
        🕉️
      </div>
      <div className="hidden sm:block absolute bottom-20 left-10 text-3xl lg:text-5xl opacity-10 animate-float text-secondary" style={{ animationDelay: '1s' }}>
        ☸️
      </div>
      <div className="hidden lg:block absolute top-1/2 left-1/4 text-4xl opacity-10 animate-float text-copper" style={{ animationDelay: '2s' }}>
        🪷
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative z-10 max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-decorative text-3xl sm:text-4xl lg:text-5xl font-bold text-glow mb-2">
                Heritage Gallery
              </h1>
              <p className="text-wheat/80 text-base sm:text-lg">
                Explore restored artifacts & enhanced historical imagery
              </p>
            </div>
            <div className="flex items-center gap-3">
              {autoRefreshing && (
                <div className="flex items-center gap-2 text-sm text-primary/70">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="hidden sm:inline">Checking for updates...</span>
                </div>
              )}
              <button
                onClick={() => fetchSessions(true)}
                className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterType={filterType}
          onFilterChange={setFilterType}
          sessionCounts={{
            total: sessions.length,
            processing: sessions.filter(s => s.sessionType === 'processing').length,
            scifi: sessions.filter(s => s.sessionType === 'scifi').length
          }}
          filteredCount={filteredSessions.length}
          userEmail={user?.email || undefined}
        />

        {/* Responsive Grid Layout */}
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12 sm:py-20 glass-effect rounded-lg border border-primary/30">
            <p className="text-lg sm:text-xl text-wheat/60">No sessions found</p>
            <p className="text-sm text-wheat/40 mt-2 px-4">Process some images in the chatbot to see them here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            {filteredSessions.map((session, index) => (
              <SessionCard
                key={session.id}
                session={session}
                index={index}
                onSessionClick={handleSessionClick}
                onContinueSession={handleContinueSession}
                onDeleteSession={handleDeleteSession}
                onDownload={(imageUrl, name, event) => {
                  event.stopPropagation();
                  handleDownload(imageUrl, name);
                }}
                onViewChat={(session, event) => {
                  event.stopPropagation();
                  setSelectedSession(session);
                  setShowChatHistory(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        <SessionModal
          session={selectedSession}
          isOpen={!!selectedSession && !showChatHistory}
          onClose={() => setSelectedSession(null)}
          onDownload={handleDownload}
          onShowChatHistory={() => setShowChatHistory(true)}
          showOriginal={showOriginal}
          onToggleOriginal={() => setShowOriginal(!showOriginal)}
        />

        <ChatHistoryModal
          session={selectedSession}
          isOpen={showChatHistory}
          onClose={() => {
            setShowChatHistory(false);
            setSelectedSession(null);
          }}
        />
      </div>
    </main>
  );
};

export default GalleryPageContent;