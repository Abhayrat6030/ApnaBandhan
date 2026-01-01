
'use client';

import { useMemo, useState } from 'react';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { useCollection, useMemoFirebase, useUser, useFirestore } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserProfile } from '@/lib/types';
import UsersClientPage from './UsersClientPage';

export default function AdminUsersPage() {
  const db = useFirestore();
  const { user } = useUser();
  const isAdmin = user?.email === 'abhayrat603@gmail.com';

  const usersQuery = useMemoFirebase(() => {
    if (!db || !isAdmin) return null;
    return collection(db, 'users');
  }, [db, isAdmin]);

  const { data: users, isLoading: areUsersLoading } = useCollection<UserProfile>(usersQuery);
  const usersMap = useMemo(() => new Map(users?.map(u => [u.uid, u])), [users]);

  const renderSkeleton = () => (
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
  );

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">Manage Users</h1>
      </div>
      {areUsersLoading ? <UsersSkeleton/> : <UsersClientPage initialUsers={users || []} initialUsersMap={usersMap} />}
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
