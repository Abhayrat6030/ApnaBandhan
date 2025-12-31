
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, ShoppingBag, Bell, Heart, Download, Gift, Award, Settings, LogOut, FileText, Smartphone, CreditCard } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
    // Mock user data
    const user = {
        name: "Rohan Sharma",
        email: "rohan.sharma@example.com",
        initials: "RS",
        avatarUrl: "https://picsum.photos/seed/profile-avatar/100/100"
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
             <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary/20">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback className="text-3xl bg-muted">{user.initials}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
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
                        <Button variant="outline" className="w-full">
                            <LogOut className="mr-2 h-4 w-4"/>
                            Logout
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
