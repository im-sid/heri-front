'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Play, Sparkles, Zap, RefreshCw, BookOpen, Trash2, Download } from 'lucide-react';

interface SessionCardProps {
  session: any;
  index: number;
  onSessionClick: (session: any) => void;
  onContinueSession: (session: any, event: React.MouseEvent) => void;
  onDeleteSession: (session: any, event: React.MouseEvent) => void;
  onDownload: (imageUrl: string, name: string, event: React.MouseEvent) => void;
  onViewChat?: (session: any, event: React.MouseEvent) => void;
}

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  index,
  onSessionClick,
  onContinueSession,
  onDeleteSession,
  onDownload,
  onViewChat
}) => {
  const getSessionName = (session: any): string => {
    return session.sessionType === 'scifi' ? session.title : session.name;
  };

  const getSessionImage = (session: any): string => {
    return session.sessionType === 'scifi' 
      ? session.artifactImageUrl 
      : (session.processedImageUrl || session.originalImageUrl);
  };

  const getSessionMessages = (session: any): any[] => {
    return session.sessionType === 'scifi' ? session.messages : session.chatMessages;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="w-full"
    >
      <div className="glass-effect rounded-lg border-2 border-primary/30 overflow-hidden group hover:border-primary transition-all duration-300 saffron-glow h-full flex flex-col">
        {/* Image */}
        <div className="relative cursor-pointer aspect-square sm:aspect-[4/3]" onClick={() => onSessionClick(session)}>
          <Image
            src={getSessionImage(session)}
            alt={getSessionName(session)}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
          />
          
          {/* Session Type Badge */}
          <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold">
            {session.sessionType === 'scifi' ? (
              <div className="bg-purple-500/90 text-white flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span className="hidden sm:inline">Sci-Fi</span>
              </div>
            ) : (
              <div className="bg-primary/90 text-dark flex items-center gap-1">
                {session.processingType === 'super-resolution' ? <Zap className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
                <span className="hidden sm:inline">AI Lab</span>
              </div>
            )}
          </div>
          
          {/* New Session Indicator - Show if created within last 5 minutes */}
          {(() => {
            const createdAt = (session as any).createdAt?.toDate?.() || new Date();
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            const isNew = createdAt > fiveMinutesAgo;
            
            return isNew ? (
              <div className="absolute top-2 left-2 px-2 py-1 bg-green-500/90 text-white rounded-full text-xs font-bold animate-pulse">
                NEW
              </div>
            ) : (
              <div className="absolute top-2 left-2 px-2 py-1 bg-green-500/90 text-white rounded-full text-xs font-bold flex items-center gap-1">
                <Play className="w-3 h-3" />
                <span className="hidden sm:inline">Continue</span>
              </div>
            );
          })()}
          
          {/* Messages indicator */}
          {getSessionMessages(session) && getSessionMessages(session).length > 0 && (
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-secondary/90 rounded-full text-xs font-bold flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span className="text-white">{getSessionMessages(session).length}</span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 space-y-2">
              <div className="grid grid-cols-2 gap-1 sm:gap-2">
                <button
                  onClick={(e) => onContinueSession(session, e)}
                  className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm ${
                    session.sessionType === 'scifi' 
                      ? 'bg-purple-500 hover:bg-purple-600' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Continue</span>
                </button>
                
                <button
                  onClick={(e) => onDeleteSession(session, e)}
                  className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors text-xs sm:text-sm"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
              
              <button
                onClick={(e) => onDownload(getSessionImage(session), getSessionName(session), e)}
                className="w-full flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-primary hover:bg-primary-dark rounded-lg transition-colors text-xs sm:text-sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Download</span>
              </button>
              
              {getSessionMessages(session) && getSessionMessages(session).length > 0 && session.sessionType === 'processing' && onViewChat && (
                <button
                  onClick={(e) => onViewChat(session, e)}
                  className="w-full flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-secondary hover:bg-secondary-dark rounded-lg transition-colors text-xs sm:text-sm"
                >
                  <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">View Chat</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          <h3 className="font-serif font-bold text-sm sm:text-lg text-primary mb-1 line-clamp-2">
            {getSessionName(session)}
          </h3>
          {session.description && (
            <p className="text-xs sm:text-sm text-wheat/70 mb-2 line-clamp-2 flex-1">{session.description}</p>
          )}
          
          <div className="mt-auto space-y-2">
            <div className="flex items-center justify-between text-xs text-wheat/50">
              <span className="truncate">
                {session.sessionType === 'scifi' 
                  ? 'Sci-Fi Workshop' 
                  : 'AI Lab Session'
                }
              </span>
              <span className="ml-2 flex-shrink-0">{getSessionMessages(session)?.length || 0} msgs</span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-wheat/40">
              <span className="truncate">
                Updated: {(session as any).updatedAt?.toDate?.()?.toLocaleDateString() || 
                         (session as any).createdAt?.toDate?.()?.toLocaleDateString() || 
                         'Recently'}
              </span>
            </div>
            
            <div className="text-xs text-green-400 font-semibold">
              {session.sessionType === 'scifi' 
                ? '✨ Continue writing'
                : '🔬 Continue analysis'
              }
            </div>
            
            {/* Processing status for AI Lab sessions */}
            {session.sessionType === 'processing' && (session as any).processingType && (
              <div className="text-xs text-blue-400 font-medium">
                📸 {(session as any).processingType === 'super-resolution' ? 'Enhanced' : 'Restored'}
              </div>
            )}
            
            {session.tags && session.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {session.tags.slice(0, 2).map((tag: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full truncate max-w-20">
                    {tag}
                  </span>
                ))}
                {session.tags.length > 2 && (
                  <span className="text-xs text-wheat/40">+{session.tags.length - 2}</span>
                )}
              </div>
            )}
            
            <div className="text-xs text-wheat/40">
              {session.createdAt?.toDate ? session.createdAt.toDate().toLocaleDateString() : 'Unknown date'}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SessionCard;