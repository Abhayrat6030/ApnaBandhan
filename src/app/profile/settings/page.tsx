
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from 'react-hook-form';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsPage() {
    const { user, isUserLoading } = useUser();

    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            name: '',
            email: '',
        }
    });

    if (user && !isUserLoading) {
      setValue('name', user.displayName || '');
      setValue('email', user.email || '');
    }

    const onSubmit = (data: any) => {
        console.log("Profile updated:", data);
        // Here you would typically call an action to update the user profile
    };

    if (isUserLoading) {
        return (
            <div className="container mx-auto px-4 py-8 md:py-16">
                 <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl">Profile Settings</CardTitle>
                        <CardDescription>Update your personal information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                               <Skeleton className="w-20 h-20 rounded-full" />
                               <Skeleton className="h-10 w-28" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                             <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }
    
    const userDetails = {
        name: user?.displayName || "Valued Customer",
        email: user?.email || "No email provided",
        initials: user?.displayName?.charAt(0).toUpperCase() || "U",
        avatarUrl: user?.photoURL || `https://picsum.photos/seed/${user?.uid || 'avatar'}/100/100`
    }

    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Profile Settings</CardTitle>
                    <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex items-center space-x-4">
                             <Avatar className="w-20 h-20 border-4 border-primary/20">
                                <AvatarImage src={userDetails.avatarUrl} alt={userDetails.name} />
                                <AvatarFallback className="text-3xl bg-muted">{userDetails.initials}</AvatarFallback>
                            </Avatar>
                            <Button variant="outline" type="button">Change Photo</Button>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" {...register('name')} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" {...register('email')} disabled />
                        </div>
                        <Button type="submit">Save Changes</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
