/**
 * Image Storage with Local Compression (Reliable Fallback)
 * External API disabled due to service issues
 */

/**
 * Compress image to data URL (primary method)
 */
const compressImageToDataUrl = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions (max 1200x900)
      let { width, height } = img;
      const maxWidth = 1200;
      const maxHeight = 900;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      // Set canvas size and draw
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convert to data URL with compression
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      console.log(`Image compressed: ${Math.round(file.size/1024)}KB → ${Math.round(dataUrl.length/1024)}KB`);
      resolve(dataUrl);
    };
    
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = URL.createObjectURL(file);
  });
};

export const uploadImage = async (
  file: File,
  userId: string,
  folder: string = 'artifacts'
): Promise<string> => {
  try {
    console.log(`Compressing image locally: ${file.name} (${Math.round(file.size/1024)}KB)`);
    
    // Use local compression (reliable and fast)
    const compressedDataUrl = await compressImageToDataUrl(file);
    console.log('✅ Image compressed successfully');
    return compressedDataUrl;
    
  } catch (error) {
    console.error('Image compression failed:', error);
    throw new Error('Failed to process image');
  }
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
  // For data URLs, no deletion needed
  console.log('Image cleanup - no action needed for data URLs');
};

/**
 * Extract filename from image URL
 */
export const getFilenameFromUrl = (url: string): string | null => {
  try {
    if (url.startsWith('data:')) {
      return `image_${Date.now()}.jpg`;
    }
    return url.split('/').pop() || null;
  } catch {
    return null;
  }
};

/**
 * Check if URL is external (not a data URL)
 */
export const isExternalUrl = (url: string): boolean => {
  return !url.startsWith('data:');
};

// Legacy exports for compatibility
export const getImageUrl = (filename: string): string => {
  return filename; // For data URLs, return as-is
};

export interface ImageUploadResponse {
  success: boolean;
  message: string;
  data: {
    filename: string;
    url: string;
    size: number;
    type: string;
  };
}