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
    formData.append('image', file);
    
    console.log(`Uploading image to external API: ${file.name}`);
    
    const response = await fetch(`${IMAGE_API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const result: ImageUploadResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Upload failed');
    }

    console.log(`Image uploaded successfully: ${result.data.url}`);
    return result.data.url;
    
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract filename from URL
    const filename = imageUrl.split('/').pop();
    if (!filename) {
      throw new Error('Invalid image URL - cannot extract filename');
    }

    console.log(`Deleting image: ${filename}`);
    
    const response = await fetch(`${IMAGE_API_BASE}/delete/${filename}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
    }

    console.log(`Image deleted successfully: ${filename}`);
    
  } catch (error) {
    console.error('Image delete error:', error);
    throw error;
  }
};

/**
 * Get image URL from filename
 */
export const getImageUrl = (filename: string): string => {
  return `https://your-project.supabase.co/storage/v1/object/public/Photos/${filename}`;
};

/**
 * Extract filename from image URL
 */
export const getFilenameFromUrl = (url: string): string | null => {
  try {
    return url.split('/').pop() || null;
  } catch {
    return null;
  }
};