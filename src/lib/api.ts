/**
 * API Configuration
 * Centralized API URL management
 */

// Get API URL from environment variable or fallback to localhost
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  health: `${API_URL}/api/health`,
  autoAnalyze: `${API_URL}/api/auto-analyze`,
  processImage: `${API_URL}/api/process-image`,
  geminiChat: `${API_URL}/api/gemini-chat`,
  historicalInfo: `${API_URL}/api/historical-info`,
  scifiStoryGenerate: `${API_URL}/api/scifi-story-generate`,
  scifiChat: `${API_URL}/api/scifi-chat`,
} as const;

/**
 * Fetch wrapper with error handling
 */
export async function apiFetch(endpoint: string, options?: RequestInit) {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
}
