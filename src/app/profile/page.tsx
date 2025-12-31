
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, ShoppingBag, Heart, LogOut } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
    { label: "My Orders", icon: ShoppingBag, href: "/profile/orders" },
    { label: "Wishlist", icon: Heart, href: "/profile/wishlist" },
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
                <CardContent>
                    <div className="space-y-2">
                        {menuItems.map(item => (
                            <Button key={item.label} variant="ghost" className="w-full justify-start text-base py-6" asChild>
                                <Link href={item.href}>
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                     <div className="mt-8">
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
