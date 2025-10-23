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

export const uploadImage = async (
  file: File,
  userId: string,
  folder: string = 'artifacts'
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('photo', file); // Correct field name is 'photo'
    
    console.log(`🔄 Uploading to external API: ${file.name} (${Math.round(file.size/1024)}KB)`);
    
    const response = await fetch(`${IMAGE_API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ External API failed (${response.status}): ${errorText}`);
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const result: ImageUploadResponse = await response.json();
    
    if (!result.success) {
      console.error(`❌ External API error: ${result.message}`);
      throw new Error(result.message || 'Upload failed');
    }

    console.log(`✅ External upload successful!`);
    console.log(`📁 File: ${result.data.filename}`);
    console.log(`🔗 URL: ${result.data.url}`);
    console.log(`📊 Size: ${Math.round(result.data.size/1024)}KB`);
    
    return result.data.url;
    
  } catch (error) {
    console.error('💥 Image upload failed:', error);
    throw error;
  }
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
  // Only delete external URLs
  if (imageUrl.startsWith('data:')) {
    console.log('⏭️ Skipping delete for data URL');
    return;
  }

  try {
    // Extract filename from URL
    const filename = imageUrl.split('/').pop();
    if (!filename) {
      console.warn('⚠️ Cannot extract filename from URL:', imageUrl);
      return;
    }

    console.log(`🗑️ Deleting external image: ${filename}`);
    
    const response = await fetch(`${IMAGE_API_BASE}/delete/${filename}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.warn(`⚠️ Delete failed: ${response.status} ${response.statusText}`);
      return;
    }

    console.log(`✅ Image deleted successfully: ${filename}`);
    
  } catch (error) {
    console.warn('⚠️ Image delete error (non-critical):', error);
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
  return filename;
};