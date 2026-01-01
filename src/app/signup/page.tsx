
'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Mail, Lock, Phone, Gift, Eye, EyeOff } from 'lucide-react';
import { signUpUser } from '@/app/actions/auth';
import { Label } from '@/components/ui/label';

const initialState = {
  message: '',
  success: false,
};

function SubmitButton() {
  // Directly using a pending state from the form could be complex without library hooks.
  // The parent component will manage the loading state.
  return null;
}

function SignupFormComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(signUpUser, initialState);
  const [showPassword, setShowPassword] = useState(false);
  
  const referralCode = searchParams.get('ref');

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Account Created!',
        description: state.message || "You are now logged in.",
      });
      router.push('/profile');
    } else if (state.message) {
      toast({
        title: 'Sign Up Failed',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, router, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4 animate-fade-in-up">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>Enter your details to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="name" name="name" placeholder="Your Name" required className="pl-10" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" name="email" type="email" placeholder="m@example.com" required className="pl-10" />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required className="pl-10 pr-10" />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                </div>
                 <p className="text-xs text-muted-foreground mt-1">Password must be at least 8 characters.</p>
              </div>

               <div>
                <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                <div className="relative mt-1">
                    <Gift className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="referralCode" name="referralCode" placeholder="Enter referral code" defaultValue={referralCode || ''} className="pl-10" />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isPending}>
                 {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </div>
          </form>
        </CardContent>
        <div className="mb-6 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
      </Card>
    </div>
  );
}


export default function SignupPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignupFormComponent />
        </Suspense>
    )
}
