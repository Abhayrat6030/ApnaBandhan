
'use client';

import { useMemo } from 'react';
import { collection, query, CollectionReference } from 'firebase/firestore';
import { useCollection, useMemoFirebase, useUser, useFirestore } from '@/firebase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserProfile } from '@/lib/types';
import UsersClientPage from './UsersClientPage';

export default function AdminUsersPage() {
  const db = useFirestore();
  const { user } = useUser();
  const isAdmin = user?.email === 'abhayrat603@gmail.com';

  const usersQuery = useMemoFirebase(() => {
    if (!db || !isAdmin) return null;
    return query(collection(db, 'users') as CollectionReference<UserProfile>);
  }, [db, isAdmin]);

  const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);
  
  if (isLoading || !isAdmin) {
      return (
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
            <div className="flex items-center">
                <h1 className="font-headline text-lg font-semibold md:text-2xl">Manage Users</h1>
            </div>
            <UsersSkeleton/>
          </main>
      )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">Manage Users</h1>
      </div>
      <UsersClientPage initialUsers={users || []} />
    </main>
  );
}

function UsersSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>View and manage all registered users.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="pb-4">
                    <Skeleton className="h-10 w-[300px]" />
                 </div>
                 <div className="border rounded-lg p-4 space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                 </div>
            </CardContent>
             <CardFooter>
                <Skeleton className="h-4 w-32" />
            </CardFooter>
        </Card>
    )
}
