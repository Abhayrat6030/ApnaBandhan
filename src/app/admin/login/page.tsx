
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from '@/components/shared/Logo';
import Link from 'next/link';

export default function AdminLoginPage() {
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would handle authentication here
        router.push('/admin/dashboard');
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <Logo className="w-12 h-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Admin Panel</CardTitle>
                    <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="admin@example.com" required defaultValue="abhayrat603@gmail.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required defaultValue="Abhay@1986*%%" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" variant="secondary">Login</Button>
                         <Button asChild variant="link" size="sm">
                            <Link href="/login">Are you a customer? Login here</Link>
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
