import React, { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

/**
 * SafeImage component that falls back to unoptimized img tag if Next.js Image fails
 */
const SafeImage: React.FC<SafeImageProps> = ({ 
  src, 
  alt, 
  fill, 
  className, 
  sizes, 
  width, 
  height, 
  priority 
}) => {
  const [useUnoptimized, setUseUnoptimized] = useState(false);
  const [imageError, setImageError] = useState(false);

  // If there's an image error, show placeholder
  if (imageError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Image unavailable</span>
      </div>
    );
  }

  // If Next.js Image failed, use regular img tag
  if (useUnoptimized) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : undefined}
        width={width}
        height={height}
        onError={() => setImageError(true)}
      />
    );
  }

  // Try Next.js Image first
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      width={width}
      height={height}
      priority={priority}
      unoptimized={false}
      onError={() => {
        console.warn(`Next.js Image failed for: ${src}, falling back to unoptimized`);
        setUseUnoptimized(true);
      }}
    />
  );
};

export default SafeImage;