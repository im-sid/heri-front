'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Download, Maximize2, Sparkles } from 'lucide-react';

interface ImageComparisonProps {
  originalImage: string;
  processedImage: string;
  onDownload: () => void;
}

const ImageComparison: React.FC<ImageComparisonProps> = ({
  originalImage,
  processedImage,
  onDownload,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging && e.type !== 'click') return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    let clientX: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-glow">Drag to Compare Original vs Enhanced</h3>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hidden sm:inline">Slide or click to compare</span>
          <span className="text-primary">{Math.round(sliderPosition)}%</span>
        </div>
      </div>

      {/* Remini-Style Comparison Container */}
      <div
        className="relative w-full h-[500px] rounded-lg overflow-hidden cursor-ew-resize select-none border-2 border-primary shadow-glow-lg"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleMove}
        onClick={handleMove}
      >
        {/* Original Image (Background) */}
        <div className="absolute inset-0">
          <Image
            src={originalImage}
            alt="Original artifact"
            fill
            className="object-contain"
            priority
          />
          <div className="absolute bottom-2 left-2 px-3 py-1 bg-dark/80 rounded-full text-xs font-sans border border-gray-600">
            Original
          </div>
        </div>

        {/* Processed Image (Foreground with clip) */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          }}
        >
          <Image
            src={processedImage}
            alt="Enhanced artifact"
            fill
            className="object-contain"
            priority
          />
          <div className="absolute bottom-2 right-2 px-3 py-1 bg-primary/80 rounded-full text-xs font-sans border border-primary">
            Enhanced
          </div>
        </div>

        {/* Slider Handle - Remini Style */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-white to-secondary cursor-ew-resize shadow-glow-lg"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Handle Circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-glow-lg flex items-center justify-center border-4 border-primary animate-pulse-slow">
            <div className="flex gap-1">
              <div className="w-1 h-5 bg-primary rounded-full"></div>
              <div className="w-1 h-5 bg-secondary rounded-full"></div>
            </div>
          </div>

          {/* Top Label */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
            Drag Me
          </div>
        </div>
      </div>

      {/* Enhanced Instructions */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          <span className="text-gray-400">Original (Left)</span>
        </div>
        <div className="text-primary animate-pulse">← Drag Slider →</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-primary">Enhanced (Right)</span>
        </div>
      </div>

      {/* Note about integrated Gemini analysis */}
      <div className="mt-4 text-center">
        <p className="text-sm text-blue-400 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          Gemini AI analysis is now integrated in the chat below
        </p>
      </div>
    </div>
  );
};

export default ImageComparison;

