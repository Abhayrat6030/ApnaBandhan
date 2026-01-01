'use client';

import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp, initializeApp, getApps, getApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged, getAuth } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { firebaseConfig } from './config';

// Define the shape of the context
interface FirebaseContextState {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Create the context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

// Memoized initialization function
const initializeFirebaseApp = () => {
  const apps = getApps();
  if (apps.length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
};

// Initialize app and services once
const app = initializeFirebaseApp();
const auth = getAuth(app);
export const db = getFirestore(app);


export const FirebaseProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  
  const [userAuthState, setUserAuthState] = useState<{
    user: User | null;
    isUserLoading: boolean;
    userError: Error | null;
  }>({
    user: auth.currentUser, // Initialize with current user if available
    isUserLoading: true,
    userError: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: null });
    }, (error) => {
      console.error("FirebaseProvider: onAuthStateChanged error:", error);
      setUserAuthState({ user: null, isUserLoading: false, userError: error });
    });
    return () => unsubscribe();
  }, []);

  const contextValue = useMemo((): FirebaseContextState => ({
    firebaseApp: app,
    firestore: db,
    auth: auth,
    user: userAuthState.user,
    isUserLoading: userAuthState.isUserLoading,
    userError: userAuthState.userError,
  }), [userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

// --- Hooks for easy access ---

export const useFirebase = (): FirebaseContextState => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  return context;
};

export const useAuth = (): Auth => {
  const context = useFirebase();
  return context.auth;
};

export const useFirestore = (): Firestore => {
  const context = useFirebase();
  return context.firestore;
};

export const useFirebaseApp = (): FirebaseApp => {
  const context = useFirebase();
  return context.firebaseApp;
};

export interface UserHookResult { 
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export const useUser = (): UserHookResult => {
  const { user, isUserLoading, userError } = useFirebase();
  return { user, isUserLoading, userError };
};
