'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, ShoppingBag, Bell, Heart, Download, Gift, Award, Settings, LogOut, FileText, Smartphone, CreditCard } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth, useUser } from "@/firebase";
import { useRouter } from "next/navigation";

const primaryMenuItems = [
    { label: "Profile", icon: User, href: "/profile/settings" },
    { label: "Notifications", icon: Bell, href: "/profile/notifications", badge: "4" },
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


export default function ProfilePage() {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await auth.signOut();
        router.push('/login');
    };

    const userDetails = {
        name: user?.displayName || "Guest User",
        email: user?.email || "guest@example.com",
        initials: user?.displayName?.charAt(0) || "G",
        avatarUrl: user?.photoURL || `https://picsum.photos/seed/${user?.uid || 'avatar'}/100/100`
    }

    if (isUserLoading) {
        return (
             <div className="container mx-auto px-4 py-8 md:py-16">
                 <Card className="max-w-2xl mx-auto animate-pulse">
                     <CardHeader className="text-center">
                         <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4"></div>
                         <div className="h-6 w-40 bg-muted rounded-md mx-auto"></div>
                         <div className="h-4 w-52 bg-muted rounded-md mx-auto mt-2"></div>
                     </CardHeader>
                      <CardContent className="p-2">
                        <div className="space-y-1 p-4">
                           <div className="h-10 bg-muted rounded-md"></div>
                           <div className="h-10 bg-muted rounded-md"></div>
                           <div className="h-10 bg-muted rounded-md"></div>
                        </div>
                     </CardContent>
                 </Card>
             </div>
        )
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8 md:py-16">
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

    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
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
                    <div className="space-y-1">
                        {primaryMenuItems.map(item => (
                            <Button key={item.label} variant="ghost" className="w-full justify-start text-base py-6" asChild>
                                <Link href={item.href}>
                                    <item.icon className="mr-4 h-5 w-5 text-muted-foreground" />
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {item.badge && <Badge>{item.badge}</Badge>}
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
