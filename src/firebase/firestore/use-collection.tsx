
'use client';

import {
  Query,
  onSnapshot,
  FirestoreError,
  DocumentData,
} from 'firebase/firestore';
import { useEffect, useState } from "react";
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}


export function useCollection<T extends DocumentData>(queryRef?: Query<T> | null): UseCollectionResult<T> {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!queryRef) {
        setIsLoading(false);
        setData(null);
        return;
    };
    
    setIsLoading(true);

    const unsubscribe = onSnapshot(
      queryRef,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as WithId<T>[];

        setData(docs);
        setIsLoading(false);
        setError(null);
      },
      (err: FirestoreError) => {
        const path = (queryRef as any)._query.path.segments.join('/');
        
        const contextualError = new FirestorePermissionError({
          operation: 'list',
          path,
        })
        
        console.error("useCollection error:", err);
        setError(contextualError);
        setIsLoading(false);
        
        // Globally emit the rich, contextual error
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [queryRef]);

  return { data, isLoading, error };
}
