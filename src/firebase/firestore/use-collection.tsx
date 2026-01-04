
'use client';

import {
  Query,
  onSnapshot,
  FirestoreError,
} from 'firebase/firestore';
import { useEffect, useState } from "react";
import type { DocumentData } from 'firebase/firestore';


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


export function useCollection<T extends DocumentData>(queryRef?: Query<T> | null) {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!queryRef) {
        setIsLoading(false);
        setData(null);
        return;
    };
    
    setIsLoading(true);

    const unsub = onSnapshot(
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
      (err) => {
        console.error("useCollection error:", err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, [queryRef]);

  return { data, isLoading, error };
}
