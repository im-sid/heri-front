import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  DocumentData 
} from 'firebase/firestore';
import { db } from './firebase';

export interface SciFiMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Timestamp;
  type?: 'story_concept' | 'character_development' | 'world_building' | 'plot_twist';
  hasImageAnalysis?: boolean;
}

export interface SciFiSession {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  artifactImageUrl?: string;
  originalImageUrl?: string;
  messages: SciFiMessage[];
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
  storyGenre?: string;
  artifactType?: string;
  civilization?: string;
}

const SCIFI_COLLECTION = 'sciFiSessions';

// Create a new sci-fi session
export const createSciFiSession = async (sessionData: Omit<SciFiSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, SCIFI_COLLECTION), {
      ...sessionData,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating sci-fi session:', error);
    throw error;
  }
};

// Get all sci-fi sessions for a user
export const getUserSciFiSessions = async (userId: string): Promise<SciFiSession[]> => {
  try {
    // Try with ordering first (requires index)
    const q = query(
      collection(db, SCIFI_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SciFiSession));
  } catch (error) {
    console.warn('Index not ready, falling back to simple query:', error);
    
    // Fallback: simple query without ordering (works without index)
    try {
      const fallbackQuery = query(
        collection(db, SCIFI_COLLECTION),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(fallbackQuery);
      const sessions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as SciFiSession));
      
      // Sort on client side
      sessions.sort((a, b) => {
        const aTime = a.createdAt?.toMillis() || 0;
        const bTime = b.createdAt?.toMillis() || 0;
        return bTime - aTime;
      });
      
      return sessions;
    } catch (fallbackError) {
      console.error('Error fetching user sci-fi sessions (fallback):', fallbackError);
      throw fallbackError;
    }
  }
};

// Get a specific sci-fi session
export const getSciFiSession = async (sessionId: string): Promise<SciFiSession | null> => {
  try {
    const docRef = doc(db, SCIFI_COLLECTION, sessionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as SciFiSession;
    }
    return null;
  } catch (error) {
    console.error('Error fetching sci-fi session:', error);
    throw error;
  }
};

// Update a sci-fi session
export const updateSciFiSession = async (sessionId: string, updates: Partial<SciFiSession>): Promise<void> => {
  try {
    const docRef = doc(db, SCIFI_COLLECTION, sessionId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating sci-fi session:', error);
    throw error;
  }
};

// Add a message to a sci-fi session
export const addMessageToSciFiSession = async (sessionId: string, message: Omit<SciFiMessage, 'id' | 'timestamp'>): Promise<void> => {
  try {
    const session = await getSciFiSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const newMessage: SciFiMessage = {
      ...message,
      timestamp: Timestamp.now()
    };

    const updatedMessages = [...session.messages, newMessage];
    
    await updateSciFiSession(sessionId, {
      messages: updatedMessages,
      isActive: true
    });
  } catch (error) {
    console.error('Error adding message to sci-fi session:', error);
    throw error;
  }
};

// Delete a sci-fi session
export const deleteSciFiSession = async (sessionId: string): Promise<void> => {
  try {
    const docRef = doc(db, SCIFI_COLLECTION, sessionId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting sci-fi session:', error);
    throw error;
  }
};

// Get recent sci-fi sessions (for dashboard)
export const getRecentSciFiSessions = async (userId: string, limitCount: number = 5): Promise<SciFiSession[]> => {
  try {
    const q = query(
      collection(db, SCIFI_COLLECTION),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SciFiSession));
  } catch (error) {
    console.error('Error fetching recent sci-fi sessions:', error);
    throw error;
  }
};

// Search sci-fi sessions by title or tags
export const searchSciFiSessions = async (userId: string, searchTerm: string): Promise<SciFiSession[]> => {
  try {
    // Get all user sessions first (Firestore doesn't support full-text search)
    const allSessions = await getUserSciFiSessions(userId);
    
    // Filter on client side
    const searchLower = searchTerm.toLowerCase();
    return allSessions.filter(session => 
      session.title.toLowerCase().includes(searchLower) ||
      session.description?.toLowerCase().includes(searchLower) ||
      session.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      session.storyGenre?.toLowerCase().includes(searchLower) ||
      session.artifactType?.toLowerCase().includes(searchLower) ||
      session.civilization?.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error('Error searching sci-fi sessions:', error);
    throw error;
  }
};