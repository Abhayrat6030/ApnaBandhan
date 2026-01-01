
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, ShoppingBag, Bell, Download, Gift, Award, Settings, LogOut, FileText, Smartphone, CreditCard, Shield } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUser, useDoc, useCollection, useMemoFirebase, useAuth, useFirestore } from "@/firebase";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { collection, query, where, doc } from "firebase/firestore";
import type { Notification } from "@/lib/types";

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
    { label: "Download App", icon: Smartphone, href: "#" },
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

    const userProfileQuery = useMemoFirebase(() => {
        if (!user || !db) return null;
        return doc(db, 'users', user.uid);
    }, [user, db]);

    const notificationsQuery = useMemoFirebase(() => {
        if (!user || !db) return null;
        return query(collection(db, 'users', user.uid, 'notifications'), where('read', '==', false));
    }, [user, db]);
    
    const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileQuery);
    const { data: unreadNotifications, isLoading: areNotificationsLoading } = useCollection<Notification>(notificationsQuery);

    const handleLogout = async () => {
        if (!auth) return;
        await auth.signOut();
        router.push('/login');
    };
    
    const isLoading = isUserLoading || areNotificationsLoading || isProfileLoading;

    if (isLoading) {
        return (
             <div className="container mx-auto px-4 py-8 md:py-16 overflow-hidden">
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
            <div className="container mx-auto px-4 py-8 md:py-16 overflow-hidden">
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
        <div className="container mx-auto px-4 py-8 md:py-16 overflow-hidden">
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
