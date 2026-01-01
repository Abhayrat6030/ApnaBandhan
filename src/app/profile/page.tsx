
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, ShoppingBag, Bell, Download, Gift, Award, Settings, LogOut, FileText, Smartphone, CreditCard, Shield } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUser, useDoc, useCollection, useMemoFirebase, useAuth, useFirestore } from "@/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { collection, query, where, doc, setDoc, getDocs, writeBatch } from "firebase/firestore";
import type { Notification, AppSettings, UserProfile } from "@/lib/types";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const primaryMenuItems = [
    { label: "Profile", icon: User, href: "/profile/settings" },
    { label: "Notifications", icon: Bell, href: "/profile/notifications", badgeKey: "notifications" },
    { label: "My Requests", icon: FileText, href: "/profile/requests" },
    { label: "Order History", icon: ShoppingBag, href: "/profile/orders" },
    { label: "Downloads", icon: Download, href: "/profile/downloads" },
];

const secondaryMenuItems = [
    { label: "Refer & Earn", icon: Gift, href: "/profile/refer-and-earn" },
    { label: "My Rewards", icon: Award, href: "/profile/rewards" },
];

const tertiaryMenuItems = [
    { label: "Payments", icon: CreditCard, href: "/profile/payments" },
    { label: "Settings", icon: Settings, href: "/profile/settings" },
];

const ADMIN_EMAIL = 'abhayrat603@gmail.com';


export default function ProfilePage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();
    const auth = useAuth();
    const db = useFirestore();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const userProfileRef = useMemoFirebase(() => {
        if (!user || !db) return null;
        return doc(db, 'users', user.uid);
    }, [user, db]);

    const notificationsQuery = useMemoFirebase(() => {
        if (!user || !db) return null;
        return query(collection(db, 'users', user.uid, 'notifications'), where('read', '==', false));
    }, [user, db]);
    
    const settingsRef = useMemoFirebase(() => db ? doc(db, 'app-settings', 'links') : null, [db]);

    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);
    const { data: unreadNotifications, isLoading: areNotificationsLoading } = useCollection<Notification>(notificationsQuery);
    const { data: appSettings, isLoading: areSettingsLoading } = useDoc<AppSettings>(settingsRef);

    // Effect to create user profile document if it doesn't exist (for new sign-ups)
    useEffect(() => {
        const createUserProfileIfNeeded = async () => {
            // Conditions to run: user is loaded and authenticated, profile is checked and doesn't exist, and we have a DB connection.
            if (user && !user.isAnonymous && !isUserLoading && !isProfileLoading && !userProfile && userProfileRef && db) {
                console.log("User profile doesn't exist, creating one...");

                const displayName = user.displayName || "New User";
                const referralCodeInput = searchParams.get('ref');

                const newUserProfileData: UserProfile = {
                    uid: user.uid,
                    displayName: displayName,
                    email: user.email || "",
                    createdAt: new Date().toISOString(),
                    referralCode: `${displayName.replace(/\s+/g, '').substring(0, 4).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`,
                    referredBy: null,
                    status: 'active',
                    referredUsers: []
                };

                // Check for a valid referral code first
                if (referralCodeInput) {
                    const usersRef = collection(db, 'users');
                    const q = query(usersRef, where("referralCode", "==", referralCodeInput));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const referrerDoc = querySnapshot.docs[0];
                        // Ensure user is not referring themselves
                        if (referrerDoc.id !== user.uid) {
                            newUserProfileData.referredBy = referrerDoc.id;

                            // Use a batch to update both documents atomically
                            const batch = writeBatch(db);
                            batch.set(userProfileRef, newUserProfileData); // Create new user doc
                            
                            const referredUsers = referrerDoc.data().referredUsers || [];
                            batch.update(referrerDoc.ref, { // Update referrer doc
                                referredUsers: [...referredUsers, user.uid]
                            });

                            await batch.commit();
                            toast({ title: "Welcome!", description: "Your account and referral have been registered." });
                            return; // Exit after successful batch commit
                        }
                    }
                }
                
                // If there was no referral code, or it was invalid/self-referral, just create the new user's document.
                try {
                    await setDoc(userProfileRef, newUserProfileData);
                    toast({ title: "Welcome!", description: "Your account has been created." });
                } catch (error) {
                    console.error("Error creating user profile:", error);
                    toast({ title: "Error", description: "Could not save user profile.", variant: "destructive" });
                }
            }
        };

        createUserProfileIfNeeded();
    }, [user, isUserLoading, isProfileLoading, userProfile, userProfileRef, db, searchParams, toast]);


    const handleLogout = async () => {
        if (!auth) return;
        await auth.signOut();
        router.push('/login');
    };
    
    const isLoading = isUserLoading || areNotificationsLoading || isProfileLoading || areSettingsLoading;

    if (isLoading && !userProfile) { // Show skeleton only on initial load
        return (
             <div className="container mx-auto px-4 py-8 md:py-16 overflow-hidden animate-fade-in-up">
                 <Card className="max-w-2xl mx-auto animate-pulse">
                     <CardHeader className="text-center">
                         <Skeleton className="w-24 h-24 rounded-full bg-muted mx-auto mb-4" />
                         <Skeleton className="h-6 w-40 bg-muted rounded-md mx-auto" />
                         <Skeleton className="h-4 w-52 bg-muted rounded-md mx-auto mt-2" />
                     </CardHeader>
                      <CardContent className="p-2">
                        <div className="space-y-1 p-4">
                           <Skeleton className="h-10 bg-muted rounded-md" />
                           <Skeleton className="h-10 bg-muted rounded-md" />
                           <Skeleton className="h-10 bg-muted rounded-md" />
                        </div>
                     </CardContent>
                 </Card>
             </div>
        )
    }

    if (!user || user.isAnonymous) {
        return (
            <div className="container mx-auto px-4 py-8 md:py-16 overflow-hidden animate-fade-in-up">
                <Card className="max-w-md mx-auto text-center">
                    <CardHeader>
                        <CardTitle>Welcome!</CardTitle>
                        <CardDescription>Please log in to view your profile and orders.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/login">Login / Sign Up</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const userDetails = {
        name: userProfile?.displayName || user?.displayName || "Valued Customer",
        email: userProfile?.email || user?.email || "No email provided",
        initials: (userProfile?.displayName || user?.displayName || "U").charAt(0).toUpperCase(),
        avatarUrl: user?.photoURL || `https://picsum.photos/seed/${user?.uid || 'avatar'}/100/100`
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-16 overflow-hidden animate-fade-in-up">
             <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/20">
                        <AvatarImage src={userDetails.avatarUrl} alt={userDetails.name} />
                        <AvatarFallback className="text-3xl bg-muted">{userDetails.initials}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl">{userDetails.name}</CardTitle>
                    <CardDescription>{userDetails.email}</CardDescription>
                </CardHeader>
                <CardContent className="p-2">

                    {user.email === ADMIN_EMAIL && (
                        <>
                            <div className="space-y-1">
                                <Button variant="ghost" className="w-full justify-start text-base py-6" asChild>
                                    <Link href="/admin/dashboard">
                                        <Shield className="mr-4 h-5 w-5 text-muted-foreground" />
                                        <span className="flex-1 text-left">Admin Panel</span>
                                    </Link>
                                </Button>
                            </div>
                            <Separator className="my-2" />
                        </>
                    )}

                    <div className="space-y-1">
                        {primaryMenuItems.map(item => (
                            <Button key={item.label} variant="ghost" className="w-full justify-start text-base py-6" asChild>
                                <Link href={item.href}>
                                    <item.icon className="mr-4 h-5 w-5 text-muted-foreground" />
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {item.badgeKey === 'notifications' && unreadNotifications && unreadNotifications.length > 0 && <Badge>{unreadNotifications.length}</Badge>}
                                </Link>
                            </Button>
                        ))}
                    </div>

                    <Separator className="my-2" />

                     <div className="space-y-1">
                        {secondaryMenuItems.map(item => (
                            <Button key={item.label} variant="ghost" className="w-full justify-start text-base py-6" asChild>
                                <Link href={item.href}>
                                    <item.icon className="mr-4 h-5 w-5 text-muted-foreground" />
                                    {item.label}
                                </Link>
                            </Button>
                        ))}
                        <Button variant="ghost" className="w-full justify-start text-base py-6" asChild>
                            <Link href={appSettings?.downloadAppLink || '#'}>
                                <Smartphone className="mr-4 h-5 w-5 text-muted-foreground" />
                                Download App
                            </Link>
                        </Button>
                    </div>

                    <Separator className="my-2" />
                    
                     <div className="space-y-1">
                        {tertiaryMenuItems.map(item => (
                            <Button key={item.label} variant="ghost" className="w-full justify-start text-base py-6" asChild>
                                <Link href={item.href}>
                                    <item.icon className="mr-4 h-5 w-5 text-muted-foreground" />
                                    {item.label}
                                </Link>
                            </Button>
                        ))}
                    </div>

                     <div className="mt-6 p-4">
                        <Button variant="outline" className="w-full" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4"/>
                            Logout
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
