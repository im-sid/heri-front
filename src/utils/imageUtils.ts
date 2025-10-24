/**
 * Image utility functions for handling different image sources
 */

/**
 * Check if an image URL is accessible
 */
export const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Image validation failed:', error);
    return false;
  }
};

/**
 * Get the image source type
 */
export const getImageSourceType = (url: string): 'imgur' | 'postimages' | 'local' | 'blob' | 'unknown' => {
  if (url.startsWith('blob:')) return 'blob';
  if (url.includes('imgur.com')) return 'imgur';
  if (url.includes('postimages.org')) return 'postimages';
  if (url.startsWith('/uploads/') || url.includes('localhost')) return 'local';
  return 'unknown';
};

/**
 * Convert local URL to full URL if needed
 */
export const normalizeImageUrl = (url: string, apiUrl?: string): string => {
  if (url.startsWith('/uploads/')) {
    const baseUrl = apiUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    return `${baseUrl}${url}`;
  }
  return url;
};

/**
 * Check if image needs CORS handling
 */
export const needsCorsHandling = (url: string): boolean => {
  const sourceType = getImageSourceType(url);
  return sourceType === 'imgur' || sourceType === 'postimages';
};

/**
 * Get appropriate Next.js Image props for different sources
 */
export const getImageProps = (url: string) => {
  const sourceType = getImageSourceType(url);
  
  return {
    // Only use unoptimized for blob URLs and unknown sources
    // Imgur and Postimages should work with Next.js optimization now
    unoptimized: sourceType === 'blob' || sourceType === 'unknown',
    crossOrigin: needsCorsHandling(url) ? 'anonymous' as const : undefined,
    priority: true
  };
};