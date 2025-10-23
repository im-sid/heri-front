'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

interface ChatHistoryModalProps {
  session: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const ChatHistoryModal: React.FC<ChatHistoryModalProps> = ({
  session,
  isOpen,
  onClose
}) => {
  if (!session) return null;

  const getSessionName = (session: any): string => {
    return session.sessionType === 'scifi' ? session.title : session.name;
  };

  const getSessionMessages = (session: any): any[] => {
    return session.sessionType === 'scifi' ? session.messages : session.chatMessages;
  };

  const formatMessageContent = (content: string) => {
    return content.split('\n').map((line: string, lineIdx: number) => {
      // Handle markdown-style formatting for sci-fi content
      if (session.sessionType === 'scifi') {
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <div key={lineIdx} className="font-bold text-primary mb-2 text-base">
              {line.replace(/\*\*/g, '')}
            </div>
          );
        }
        
        if (line.startsWith('📚 **Genres:**')) {
          return (
            <div key={lineIdx} className="text-purple-300 font-semibold mb-2">
              {line.replace(/\*\*/g, '')}
            </div>
          );
        }
        
        if (line.startsWith('🌌') || line.startsWith('🎣') || line.startsWith('⚡') || line.startsWith('👤')) {
          return (
            <div key={lineIdx} className="text-lg font-bold text-secondary mb-3 border-b border-secondary/30 pb-2">
              {line}
            </div>
          );
        }
        
        if (line.match(/^\d+\./)) {
          return (
            <div key={lineIdx} className="font-semibold text-primary mb-2">
              {line}
            </div>
          );
        }
        
        if (line.startsWith('•') || line.startsWith('-')) {
          return (
            <div key={lineIdx} className="ml-4 text-gray-300 mb-1">
              {line}
            </div>
          );
        }
      }
      
      if (line.trim() === '') {
        return <div key={lineIdx} className="mb-2"></div>;
      }
      
      return (
        <div key={lineIdx} className="text-gray-300 mb-1 leading-relaxed">
          {line}
        </div>
      );
    });
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
          <div className="relative max-w-4xl w-full h-[90vh] sm:h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onClose}
              className="absolute -top-8 sm:-top-12 right-0 p-2 text-white hover:text-primary transition-colors z-10"
            >
              <X className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <div className="glass-effect rounded-lg border-2 border-primary h-full flex flex-col">
              {/* Header */}
              <div className="p-3 sm:p-6 border-b border-primary/30">
                <h2 className="font-decorative text-lg sm:text-2xl font-bold text-primary mb-2">
                  {session.sessionType === 'scifi' ? 'Story Content' : 'Chat History'}: {getSessionName(session)}
                </h2>
                <p className="text-wheat/70 text-sm sm:text-base">
                  {getSessionMessages(session)?.length || 0} messages
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
                {getSessionMessages(session)?.map((msg: any, idx: number) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`${
                      msg.role === 'user' ? 'max-w-[80%]' : 
                      session.sessionType === 'scifi' && msg.role === 'assistant' ? 'max-w-[95%]' : 'max-w-[80%]'
                    } p-6 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-primary/20 border border-primary/50' 
                        : session.sessionType === 'scifi'
                          ? 'bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-purple-500/10 border border-purple-500/30 shadow-lg'
                          : 'bg-gradient-to-r from-secondary/10 to-primary/10 border border-secondary/30'
                    }`}>
                      {(msg.hasImageAnalysis || msg.type) && (
                        <div className="text-xs mb-3 flex items-center gap-2">
                          {session.sessionType === 'scifi' ? (
                            <div className={`px-3 py-1 rounded-full flex items-center gap-1 ${
                              msg.type === 'story_concept' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                              msg.type === 'plot_hook' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                              msg.type === 'tech_concept' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                              msg.type === 'character' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' :
                              'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                            }`}>
                              {msg.type === 'story_concept' && '🌌'}
                              {msg.type === 'plot_hook' && '🎣'}
                              {msg.type === 'tech_concept' && '⚡'}
                              {msg.type === 'character' && '👤'}
                              {msg.type === 'chat' && '💬'}
                              <span className="font-semibold">
                                {msg.type === 'chat' ? 'Chat' : msg.type?.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                          ) : (
                            <div className="text-purple-400 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Image Analysis
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-300 whitespace-pre-wrap">
                        {session.sessionType === 'scifi' ? formatMessageContent(msg.content) : msg.content}
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-2">
                        {msg.createdAt?.toDate?.()?.toLocaleString() || 'Unknown time'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-3 sm:p-6 border-t border-primary/30">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg transition-colors text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatHistoryModal;