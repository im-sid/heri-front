'use client';

import React from 'react';
import { Loader } from 'lucide-react';

interface ProgressBarProps {
  progress: number; // 0-100
  status?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'secondary' | 'copper';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  status = 'Processing...',
  showPercentage = true,
  color = 'primary'
}) => {
  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    copper: 'bg-copper'
  };

  const glowClasses = {
    primary: 'shadow-glow',
    secondary: 'shadow-gold-glow',
    copper: 'shadow-copper-glow'
  };

  return (
    <div className="w-full space-y-2">
      {/* Status Text */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Loader className="w-4 h-4 animate-spin text-primary" />
          <span className="text-wheat/80 font-medium">{status}</span>
        </div>
        {showPercentage && (
          <span className="text-primary font-bold">{Math.round(progress)}%</span>
        )}
      </div>

      {/* Progress Bar Track */}
      <div className="relative w-full h-3 bg-dark-lighter rounded-full overflow-hidden border border-primary/30">
        {/* Progress Fill */}
        <div
          className={`absolute inset-y-0 left-0 ${colorClasses[color]} ${glowClasses[color]} transition-all duration-300 ease-out rounded-full`}
          style={{ width: `${progress}%` }}
        >
          {/* Animated Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
        </div>

        {/* Pulsing Dots */}
        {progress < 100 && (
          <div className="absolute inset-0 flex items-center justify-center gap-1">
            <div className="w-1 h-1 bg-white/50 rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>

      {/* Progress Stages */}
      <div className="flex items-center justify-between text-xs text-wheat/60">
        <span className={progress >= 25 ? 'text-primary' : ''}>Uploading...</span>
        <span className={progress >= 50 ? 'text-primary' : ''}>Processing...</span>
        <span className={progress >= 75 ? 'text-primary' : ''}>Enhancing...</span>
        <span className={progress >= 100 ? 'text-primary' : ''}>Complete!</span>
      </div>
    </div>
  );
};

export default ProgressBar;


