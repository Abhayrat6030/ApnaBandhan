
'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Loader2, Search, Slash, CheckCircle, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import type { UserProfile } from '@/lib/types';
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
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useFirestore, useAuth } from '@/firebase';
import { deleteUser as deleteFirebaseAuthUser } from 'firebase/auth';

export default function UsersClientPage({ initialUsers, initialUsersMap }: { initialUsers: UserProfile[], initialUsersMap: Map<string, UserProfile>}) {
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();
  const auth = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isPending, startTransition] = useTransition();
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);

  const filteredUsers = useMemo(() => {
    if (!initialUsers) return [];
    return initialUsers.filter(user =>
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.referralCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [initialUsers, searchTerm]);
  
  const handleUpdateStatus = (userId: string, newStatus: 'active' | 'blocked') => {
      if (!db) return;
      startTransition(async () => {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { status: newStatus });
            toast({
                title: `User ${newStatus === 'active' ? 'Unblocked' : 'Blocked'}`,
                description: `The user status has been updated.`,
            });
            router.refresh();
        } catch (error: any) {
            toast({
                title: "Update Failed",
                description: "You don't have permission to perform this action.",
                variant: 'destructive',
            });
        }
      });
  }
  
  const handleDeleteUser = async () => {
    if (!userToDelete || !db || !auth?.currentUser) return;
    
    startTransition(async () => {
        try {
            // Firestore rules should prevent non-admins from doing this.
            // This is a client-side action that will be validated by Firestore rules.
            await deleteDoc(doc(db, 'users', userToDelete.uid));
            
            // IMPORTANT: Deleting a user from Firebase Auth cannot be done from the client-side
            // SDK for security reasons. This must be done via a secure server environment
            // (e.g., a Cloud Function or a secure server endpoint).
            // For now, we will only delete the Firestore record.
            
            toast({
                title: "User Deleted from Database",
                description: `${userToDelete.displayName}'s profile has been deleted. Auth user still exists.`,
            });
            setUserToDelete(null);
            router.refresh();
        } catch (error: any) {
            console.error("Deletion Error:", error);
            toast({
                title: "Deletion Failed",
                description: "You don't have permission to perform this action.",
                variant: "destructive",
            });
        }
    });
  }

  return (
    <>
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
                  className="w-full sm:w-[300px] pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
          </div>
          <div className="border rounded-lg">
            <>
                {/* Desktop Table */}
                <div className="hidden md:block">
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Referred By</TableHead>
                            <TableHead>Own Code</TableHead>
                             <TableHead>Referrals</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length > 0 ? filteredUsers.map(user => {
                                const referrer = user.referredBy ? initialUsersMap.get(user.referredBy) : null;
                                return (
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
                                    {referrer ? (
                                        <div className="grid">
                                            <div className="font-medium text-xs">{referrer.displayName}</div>
                                            <div className="text-xs text-muted-foreground">{referrer.email}</div>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground text-xs">N/A</span>
                                    )}
                                    </TableCell>
                                    <TableCell>
                                    <Badge variant="secondary">{user.referralCode || 'N/A'}</Badge>
                                    </TableCell>
                                    <TableCell>
                                      <span className="font-medium">{(user.referredUsers || []).length}</span>
                                    </TableCell>
                                    <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                                    <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button size="icon" variant="ghost" disabled={isPending}>
                                            {isPending ? <Loader2 className="h-4 w-4 animate-spin"/> : <MoreHorizontal className="h-4 w-4" />}
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
                                )
                            }) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">No users found.</TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile Cards */}
                <div className="block md:hidden p-4 space-y-4">
                    {filteredUsers.length > 0 ? filteredUsers.map(user => {
                      const referrer = user.referredBy ? initialUsersMap.get(user.referredBy) : null;
                      return (
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
                                        <Button size="icon" variant="ghost" disabled={isPending} className="-mt-2 -mr-2">
                                            {isPending ? <Loader2 className="h-4 w-4 animate-spin"/> : <MoreHorizontal className="h-4 w-4" />}
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
                            <CardContent className="p-4 pt-2 space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Status</span>
                                    <Badge variant={user.status === 'blocked' ? 'destructive' : 'default'} className="capitalize">
                                        {user.status || 'active'}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Own Code</span>
                                     <Badge variant="secondary">{user.referralCode || 'N/A'}</Badge>
                                </div>
                                 <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Referred By</span>
                                    <span>{referrer ? referrer.displayName : 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Referrals</span>
                                    <span className="font-medium">{(user.referredUsers || []).length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Joined</span>
                                    <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </CardContent>
                        </Card>
                      )
                    }) : (
                        <div className="h-24 text-center flex items-center justify-center">
                            <p>No users found.</p>
                        </div>
                    )}
                </div>
            </>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{filteredUsers.length}</strong> of <strong>{initialUsers?.length || 0}</strong> users.
          </div>
        </CardFooter>
      </Card>

    <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the user <span className="font-bold">{userToDelete?.displayName}</span> from the Firestore database. Deleting the user from Firebase Authentication must be done from a secure server environment.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={handleDeleteUser}
                    disabled={isPending}
                >
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Delete User
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
