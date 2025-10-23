import { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ProcessingResult {
  processedImageUrl: string;
  message: string;
  metadata?: any;
}

export const useImageProcessing = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = async (
    file: File,
    processType: 'super-resolution' | 'restoration',
    intensity: number = 0.75
  ): Promise<ProcessingResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('process_type', processType);
      formData.append('intensity', (intensity / 100).toString()); // Convert 0-100 to 0.0-1.0

      console.log(`[API] Processing ${processType} with intensity ${intensity}%...`);
      console.log(`[API] Sending request to ${API_URL}/api/process-image`);

      const response = await axios.post(`${API_URL}/api/process-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 SECOND TIMEOUT
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`[API] Upload progress: ${percent}%`);
          }
        }
      });

      console.log(`[API] ✅ Response received!`);
      console.log(`[API] Status: ${response.data.status}`);
      console.log(`[API] Processing time: ${response.data.metadata?.processing_time}`);
      
      setLoading(false);
      return response.data;
    } catch (err: any) {
      console.error(`[API] ❌ Error:`, err);
      
      if (err.code === 'ECONNABORTED') {
        setError('Processing timeout (>60s). Please try a smaller image or lower intensity.');
      } else {
        const errorMessage = err.response?.data?.error || 'Failed to process image. Check if backend is running.';
        setError(errorMessage);
      }
      
      setLoading(false);
      return null;
    }
  };

  const getHistoricalInfo = async (
    imageUrl: string,
    userQuery?: string,
    artifactContext?: any
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/historical-info`, {
        image_url: imageUrl,
        query: userQuery,
        artifact_context: artifactContext,
      });

      setLoading(false);
      return response.data.information;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to get historical information. Please check if the backend server is running.';
      setError(errorMessage);
      setLoading(false);
      return errorMessage;
    }
  };

  const analyzeArtifact = async (imageUrl: string): Promise<any | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/analyze-artifact`, {
        image_url: imageUrl,
      });

      setLoading(false);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to analyze artifact';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  return {
    processImage,
    getHistoricalInfo,
    analyzeArtifact,
    loading,
    error,
  };
};


