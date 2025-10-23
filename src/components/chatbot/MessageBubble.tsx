'use client';

import React from 'react';
import { User, Sparkles, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content, imageUrl }) => {
  const isUser = role === 'user';

  const handleDownloadImage = () => {
    if (!imageUrl) return;
    
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `heri-science-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start space-x-3 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
          isUser
            ? 'bg-primary/20 border-primary'
            : 'bg-secondary/20 border-secondary'
        }`}>
          {isUser ? (
            <User className="w-5 h-5" />
          ) : (
            <Sparkles className="w-5 h-5 animate-glow-pulse" />
          )}
        </div>

        {/* Message content */}
        <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
          <div className={`inline-block glass-effect p-4 rounded-lg border ${
            isUser
              ? 'border-primary/30 bg-primary/5'
              : 'border-secondary/30 bg-secondary/5'
          }`}>
            {imageUrl && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden mb-3 group">
                <Image
                  src={imageUrl}
                  alt="Message image"
                  fill
                  className="object-contain"
                />
                <button
                  onClick={handleDownloadImage}
                  className="absolute top-2 right-2 p-2 bg-dark/80 hover:bg-primary/80 rounded-lg border border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  title="Download image"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1 px-2">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;


