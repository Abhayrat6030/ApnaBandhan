
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from 'react-hook-form';

export default function SettingsPage() {
    // Mock user data
    const user = {
        name: "Rohan Sharma",
        email: "rohan.sharma@example.com",
        initials: "RS",
        avatarUrl: "https://picsum.photos/seed/profile-avatar/100/100"
    }

    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: user.name,
            email: user.email,
        }
    });

    const onSubmit = (data: any) => {
        console.log("Profile updated:", data);
        // Here you would typically call an action to update the user profile
    };

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
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                <AvatarFallback className="text-3xl bg-muted">{user.initials}</AvatarFallback>
                            </Avatar>
                            <Button variant="outline" type="button">Change Photo</Button>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" {...register('name')} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" {...register('email')} />
                        </div>
                        <Button type="submit">Save Changes</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
