'use client';

import { useMemo, useState } from 'react';
import { collection, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Loader2, Search, Slash, CheckCircle, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminUsersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);

  const usersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'users'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: users, isLoading: areUsersLoading } = useCollection<UserProfile>(usersQuery);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(user =>
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.referralCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const isLoading = areUsersLoading;
  
  const handleUpdateStatus = async (userId: string, newStatus: 'active' | 'blocked') => {
      if (!db) return;
      setIsUpdating(`status-${userId}`);
      try {
          const userRef = doc(db, 'users', userId);
          await updateDoc(userRef, { status: newStatus });
          toast({
              title: `User ${newStatus === 'active' ? 'Unblocked' : 'Blocked'}`,
              description: `The user status has been updated.`,
          });
      } catch (error: any) {
          toast({
              title: "Update Failed",
              description: error.message || 'Could not update user status.',
              variant: 'destructive',
          });
      }
      setIsUpdating(null);
  }
  
  const handleDeleteUser = async () => {
    if (!userToDelete || !db) return;
    setIsUpdating(`delete-${userToDelete.uid}`);
    
    try {
        const userDocRef = doc(db, 'users', userToDelete.uid);
        await deleteDoc(userDocRef);
        // Note: This only deletes the Firestore record. The Firebase Auth user is not deleted.
        // A cloud function would be required to delete the auth user when the doc is deleted.
        toast({
            title: "User Deleted",
            description: `${userToDelete.displayName} (${userToDelete.email})'s data has been deleted from Firestore.`,
        });
    } catch (error: any) {
        toast({
            title: "Deletion Failed",
            description: error.message || "Could not delete user from Firestore.",
            variant: "destructive",
        });
    }
    
    setIsUpdating(null);
    setUserToDelete(null);
  }

  const renderSkeleton = () => (
    <div className="p-4 md:p-0">
        {/* Desktop Skeleton */}
      <div className="hidden md:block">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Referred By</TableHead>
                <TableHead>Own Referral Code</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                <TableCell className="flex items-center gap-2"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
      </div>
      {/* Mobile Skeleton */}
      <div className="block md:hidden space-y-4">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-36 w-full rounded-lg" />)}
      </div>
    </div>
  );

  return (
    <>
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 animate-fade-in-up">
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">Manage Users</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>View and manage all registered users.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="pb-4">
             <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name, email, or referral..."
                  className="pl-8 sm:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
          </div>
          <div className="border rounded-lg">
          {isLoading ? renderSkeleton() : (
            <>
                {/* Desktop Table */}
                <div className="hidden md:block">
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Referred By</TableHead>
                            <TableHead>Own Referral Code</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length > 0 ? filteredUsers.map(user => (
                            <TableRow key={user.uid}>
                                <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                    <AvatarImage src={user.photoURL || `https://avatar.vercel.sh/${user.email}.png`} />
                                    <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid">
                                    <div className="font-medium">{user.displayName}</div>
                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                    </div>
                                </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.status === 'blocked' ? 'destructive' : 'default'} className="capitalize">
                                        {user.status || 'active'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                {user.referredBy ? (
                                    <Badge variant="outline">{user.referredBy}</Badge>
                                ) : (
                                    <span className="text-muted-foreground text-xs">N/A</span>
                                )}
                                </TableCell>
                                <TableCell>
                                <Badge variant="secondary">{user.referralCode || 'N/A'}</Badge>
                                </TableCell>
                                <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                                <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="ghost" disabled={!!isUpdating}>
                                        {isUpdating?.endsWith(user.uid) ? <Loader2 className="h-4 w-4 animate-spin"/> : <MoreHorizontal className="h-4 w-4" />}
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                                        <DropdownMenuItem>View Orders</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        {user.status === 'blocked' ? (
                                            <DropdownMenuItem onClick={() => handleUpdateStatus(user.uid, 'active')}>
                                                <CheckCircle className="mr-2 h-4 w-4" /> Unblock User
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem className="text-destructive" onClick={() => handleUpdateStatus(user.uid, 'blocked')}>
                                                <Slash className="mr-2 h-4 w-4" /> Block User
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive" onClick={() => setUserToDelete(user)}>
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete User
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            )) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">No users found.</TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile Cards */}
                <div className="block md:hidden p-4 space-y-4">
                    {filteredUsers.length > 0 ? filteredUsers.map(user => (
                        <Card key={user.uid}>
                            <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                      <AvatarImage src={user.photoURL || `https://avatar.vercel.sh/${user.email}.png`} />
                                      <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <div className="grid">
                                      <div className="font-medium">{user.displayName}</div>
                                      <div className="text-xs text-muted-foreground">{user.email}</div>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="icon" variant="ghost" disabled={!!isUpdating} className="-mt-2 -mr-2">
                                            {isUpdating?.endsWith(user.uid) ? <Loader2 className="h-4 w-4 animate-spin"/> : <MoreHorizontal className="h-4 w-4" />}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {user.status === 'blocked' ? (
                                            <DropdownMenuItem onClick={() => handleUpdateStatus(user.uid, 'active')}>
                                                <CheckCircle className="mr-2 h-4 w-4" /> Unblock
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem className="text-destructive" onClick={() => handleUpdateStatus(user.uid, 'blocked')}>
                                                <Slash className="mr-2 h-4 w-4" /> Block
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive" onClick={() => setUserToDelete(user)}>
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent className="p-4 pt-2 space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Status</span>
                                    <Badge variant={user.status === 'blocked' ? 'destructive' : 'default'} className="capitalize">
                                        {user.status || 'active'}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Referral Code</span>
                                     <Badge variant="secondary">{user.referralCode || 'N/A'}</Badge>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Joined</span>
                                    <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </CardContent>
                        </Card>
                    )) : (
                        <div className="h-24 text-center flex items-center justify-center">
                            <p>No users found.</p>
                        </div>
                    )}
                </div>
            </>
          )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{filteredUsers.length}</strong> of <strong>{users?.length || 0}</strong> users.
          </div>
        </CardFooter>
      </Card>
    </main>

    <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will permanently delete the user's data from Firestore <span className="font-bold">{userToDelete?.displayName} ({userToDelete?.email})</span>. This action cannot be undone. Note: The Firebase Auth user will remain.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={handleDeleteUser}
                    disabled={!!isUpdating}
                >
                    {isUpdating?.startsWith('delete-') ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Delete
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
