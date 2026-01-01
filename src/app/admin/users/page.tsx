
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllUsers } from '@/app/actions/admin';
import UsersClientPage from './UsersClientPage';

async function UsersList() {
    const { users, usersMap } = await getAllUsers();
    return <UsersClientPage initialUsers={users} initialUsersMap={usersMap} />;
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

export default function AdminUsersPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">Manage Users</h1>
      </div>
      <Suspense fallback={<UsersSkeleton/>}>
        <UsersList/>
      </Suspense>
    </main>
  );
}
