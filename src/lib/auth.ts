import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export type UserRole = 'admin' | 'curator' | 'researcher';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  createdAt: string;
  lastLogin: string;
}

export const registerUser = async (
  email: string,
  password: string,
  displayName: string,
  role: UserRole = 'researcher'
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      role,
      displayName,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'users', user.uid), userProfile);
    } catch (dbError) {
      console.warn('Could not create user profile in Firestore:', dbError);
      // Continue even if DB creation fails
    }

    return user;
  } catch (error: any) {
    // Provide user-friendly error messages
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('An account with this email already exists. Please login instead.');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('Password is too weak. Please use at least 6 characters.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address format.');
    }
    throw error;
  }
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login
    try {
      await setDoc(
        doc(db, 'users', userCredential.user.uid),
        { lastLogin: new Date().toISOString() },
        { merge: true }
      );
    } catch (dbError) {
      console.warn('Could not update last login:', dbError);
      // Continue even if DB update fails
    }

    return userCredential.user;
  } catch (error: any) {
    // Provide user-friendly error messages
    if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email. Please sign up first.');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password. Please try again.');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address format.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed attempts. Please try again later.');
    } else if (error.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password. Please check your credentials.');
    }
    throw error;
  }
};

export const loginWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;

  // Check if user profile exists
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  
  if (!userDoc.exists()) {
    // Create new user profile
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      role: 'researcher',
      displayName: user.displayName || '',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', user.uid), userProfile);
  } else {
    // Update last login
    await setDoc(
      doc(db, 'users', user.uid),
      { lastLogin: new Date().toISOString() },
      { merge: true }
    );
  }

  return user;
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.warn('Could not fetch user profile from Firestore:', error);
    return null;
  }
};


