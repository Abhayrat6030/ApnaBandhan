'use client';

import {
  Query,
  onSnapshot,
  FirestoreError,
  DocumentData,
} from 'firebase/firestore';
import { useEffect, useState } from "react";

export type WithId<T> = T & { id: string };

export interface UseCollectionResult<T> {
  data: WithId<T>[] | null;
  isLoading: boolean;
  error: FirestoreError | Error | null;
}

export function useCollection<T extends DocumentData>(
  queryRef?: Query<T> | null
): UseCollectionResult<T> {

  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!queryRef) {
      setIsLoading(false);
      setData(null);
      return;
    }

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
      (err) => {
        console.error(err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [queryRef]);

  return { data, isLoading, error };
}
