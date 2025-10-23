/**
 * Image Storage using External API
 * Uses tree-photo-module.onrender.com for image hosting
 */

const IMAGE_API_BASE = 'https://tree-photo-module.onrender.com';

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

/**
 * Compress image to data URL (fallback method)
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
      console.log(`Image compressed locally: ${Math.round(dataUrl.length/1024)}KB`);
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
  // Try external API first
  try {
    const formData = new FormData();
    formData.append('photo', file); // Correct field name is 'photo', not 'image'
    
    console.log(`Uploading to external API: ${file.name} (${Math.round(file.size/1024)}KB)`);
    
    const response = await fetch(`${IMAGE_API_BASE}/upload`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - let browser set it for FormData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`External API failed (${response.status}): ${errorText}`);
      throw new Error(`External API failed: ${response.status}`);
    }

    const result: ImageUploadResponse = await response.json();
    
    if (!result.success) {
      console.warn(`External API returned error: ${result.message}`);
      throw new Error(result.message || 'External API upload failed');
    }

    console.log(`✅ External upload successful: ${result.data.url}`);
    console.log(`File details: ${result.data.filename} (${Math.round(result.data.size/1024)}KB)`);
    return result.data.url;
    
  } catch (externalError) {
    console.warn('External API upload failed, using local compression fallback:', externalError);
    
    // Fallback to local compression
    try {
      const compressedDataUrl = await compressImageToDataUrl(file);
      console.log('✅ Local compression fallback successful');
      return compressedDataUrl;
    } catch (fallbackError) {
      console.error('Both external API and local compression failed:', fallbackError);
      throw new Error('Image upload failed: Both external API and local compression failed');
    }
  }
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
  // Only try to delete if it's an external URL (not data URL)
  if (imageUrl.startsWith('data:')) {
    console.log('Skipping delete for local data URL');
    return;
  }

  try {
    // Extract filename from URL
    const filename = imageUrl.split('/').pop();
    if (!filename) {
      throw new Error('Invalid image URL - cannot extract filename');
    }

    console.log(`Deleting external image: ${filename}`);
    
    const response = await fetch(`${IMAGE_API_BASE}/delete/${filename}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.warn(`Delete failed: ${response.status} ${response.statusText}`);
      // Don't throw error for delete failures - not critical
      return;
    }

    console.log(`✅ Image deleted successfully: ${filename}`);
    
  } catch (error) {
    console.warn('Image delete error (non-critical):', error);
    // Don't throw - delete failures shouldn't break the app
  }
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
  return filename; // For external URLs, return as-is
};