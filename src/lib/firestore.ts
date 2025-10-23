import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface Artifact {
  id?: string;
  userId: string;
  imageUrl: string;
  processedImageUrl?: string;
  name: string;
  description?: string;
  origin?: string;
  era?: string;
  conditionScore?: number;
  processingType?: 'super-resolution' | 'restoration' | 'none';
  metadata?: Record<string, any>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ChatMessage {
  id?: string;
  userId: string;
  artifactId?: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  createdAt: Timestamp;
}

export interface ProcessingSession {
  id?: string;
  userId: string;
  name: string;
  description?: string;
  originalImageUrl: string;
  processedImageUrl?: string;
  processingType?: 'super-resolution' | 'restoration';
  chatMessages: ChatMessage[];
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}

// Artifact operations
export const createArtifact = async (artifact: Omit<Artifact, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'artifacts'), {
      ...artifact,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.warn('Could not save artifact to Firestore:', error);
    throw new Error('Failed to save artifact. Firebase not fully configured.');
  }
};

export const getArtifact = async (id: string): Promise<Artifact | null> => {
  const docRef = doc(db, 'artifacts', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Artifact;
  }
  return null;
};

export const getUserArtifacts = async (userId: string): Promise<Artifact[]> => {
  try {
    const q = query(
      collection(db, 'artifacts'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artifact));
  } catch (error) {
    console.error('Error fetching user artifacts:', error);
    return []; // Return empty array if error
  }
};

export const updateArtifact = async (id: string, data: Partial<Artifact>): Promise<void> => {
  const docRef = doc(db, 'artifacts', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

export const deleteArtifact = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'artifacts', id));
};

// Chat operations
export const createChatMessage = async (
  message: Omit<ChatMessage, 'id' | 'createdAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'chatMessages'), {
      ...message,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.warn('Could not save message to Firestore:', error);
    return 'local-only'; // Return dummy ID, app continues to work
  }
};

export const getUserChatHistory = async (userId: string, limitCount: number = 50): Promise<ChatMessage[]> => {
  try {
    const q = query(
      collection(db, 'chatMessages'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage)).reverse();
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return []; // Return empty array if error
  }
};

// Admin operations
export const getAllArtifacts = async (): Promise<Artifact[]> => {
  try {
    const q = query(collection(db, 'artifacts'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artifact));
  } catch (error) {
    console.warn('Could not fetch artifacts from Firestore:', error);
    return [];
  }
};

export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn('Could not fetch users from Firestore:', error);
    return [];
  }
};

// Processing Session operations
const PROCESSING_SESSIONS_COLLECTION = 'processingSessions';

export const createProcessingSession = async (sessionData: Omit<ProcessingSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, PROCESSING_SESSIONS_COLLECTION), {
      ...sessionData,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating processing session:', error);
    throw error;
  }
};

export const getUserProcessingSessions = async (userId: string): Promise<ProcessingSession[]> => {
  try {
    // Try with ordering first (requires index)
    const q = query(
      collection(db, PROCESSING_SESSIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ProcessingSession));
  } catch (error) {
    console.warn('Index not ready, falling back to simple query:', error);
    
    // Fallback: simple query without ordering (works without index)
    try {
      const fallbackQuery = query(
        collection(db, PROCESSING_SESSIONS_COLLECTION),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(fallbackQuery);
      const sessions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ProcessingSession));
      
      // Sort on client side
      sessions.sort((a, b) => {
        const aTime = a.createdAt?.toMillis() || 0;
        const bTime = b.createdAt?.toMillis() || 0;
        return bTime - aTime;
      });
      
      return sessions;
    } catch (fallbackError) {
      console.error('Error fetching user processing sessions (fallback):', fallbackError);
      return [];
    }
  }
};

export const getProcessingSession = async (sessionId: string): Promise<ProcessingSession | null> => {
  try {
    const docRef = doc(db, PROCESSING_SESSIONS_COLLECTION, sessionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as ProcessingSession;
    }
    return null;
  } catch (error) {
    console.error('Error fetching processing session:', error);
    throw error;
  }
};

export const updateProcessingSession = async (sessionId: string, updates: Partial<ProcessingSession>): Promise<void> => {
  try {
    const docRef = doc(db, PROCESSING_SESSIONS_COLLECTION, sessionId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating processing session:', error);
    throw error;
  }
};

export const deleteProcessingSession = async (sessionId: string): Promise<void> => {
  try {
    const docRef = doc(db, PROCESSING_SESSIONS_COLLECTION, sessionId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting processing session:', error);
    throw error;
  }
};

export const addMessageToProcessingSession = async (sessionId: string, message: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<void> => {
  try {
    const session = await getProcessingSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const newMessage: ChatMessage = {
      ...message,
      createdAt: Timestamp.now()
    };

    const updatedMessages = [...session.chatMessages, newMessage];
    
    await updateProcessingSession(sessionId, {
      chatMessages: updatedMessages,
      isActive: true
    });
  } catch (error) {
    console.error('Error adding message to processing session:', error);
    throw error;
  }
};


