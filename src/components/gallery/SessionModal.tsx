'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Download, Sparkles } from 'lucide-react';

interface SessionModalProps {
  session: any | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (imageUrl: string, name: string) => void;
  onShowChatHistory?: () => void;
  showOriginal?: boolean;
  onToggleOriginal?: () => void;
}

const SessionModal: React.FC<SessionModalProps> = ({
  session,
  isOpen,
  onClose,
  onDownload,
  onShowChatHistory,
  showOriginal,
  onToggleOriginal
}) => {
  if (!session) return null;

  const getSessionName = (session: any): string => {
    return session.sessionType === 'scifi' ? session.title : session.name;
  };

  const getSessionImage = (session: any): string => {
    if (showOriginal && session.originalImageUrl) {
      return session.originalImageUrl;
    }
    return session.sessionType === 'scifi' 
      ? session.artifactImageUrl 
      : (session.processedImageUrl || session.originalImageUrl);
  };

  const getSessionMessages = (session: any): any[] => {
    return session.sessionType === 'scifi' ? session.messages : session.chatMessages;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={onClose}
        >
          <div className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onClose}
              className="absolute -top-8 sm:-top-12 right-0 p-2 text-white hover:text-primary transition-colors z-10"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <div className="glass-effect rounded-lg border-2 border-primary p-3 sm:p-6">
              <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                <Image
                  src={getSessionImage(session)}
                  alt={getSessionName(session)}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h2 className="font-decorative text-xl sm:text-2xl font-bold text-primary mb-2">
                    {getSessionName(session)}
                  </h2>
                  <p className="text-wheat/70 text-sm sm:text-base">{session.description}</p>
                  {session.tags && session.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {session.tags.map((tag: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-primary/20 text-primary text-xs sm:text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {session.sessionType === 'processing' && session.processedImageUrl && onToggleOriginal && (
                    <button
                      onClick={onToggleOriginal}
                      className="px-4 py-2 glass-effect border border-secondary rounded-lg hover:bg-secondary/20 transition-colors text-sm"
                    >
                      {showOriginal ? 'Show Enhanced' : 'Show Original'}
                    </button>
                  )}
                  
                  {getSessionMessages(session) && getSessionMessages(session).length > 0 && onShowChatHistory && (
                    <button
                      onClick={onShowChatHistory}
                      className="px-4 py-2 bg-secondary hover:bg-secondary-dark rounded-lg transition-colors flex items-center gap-2 text-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      {session.sessionType === 'scifi' ? 'View Stories' : 'View Chat'} ({getSessionMessages(session).length})
                    </button>
                  )}
                  
                  <button
                    onClick={() => onDownload(getSessionImage(session), getSessionName(session))}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg transition-colors flex items-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SessionModal;