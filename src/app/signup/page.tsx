
'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useFormStatus, useState, useEffect, Suspense } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Mail, Lock, Gift, Eye, EyeOff } from 'lucide-react';
import { signUpUser } from '@/app/actions/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase';

const initialState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
       {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Create Account
    </Button>
  );
}

function SignupFormComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [formState, formAction] = useActionState(signUpUser, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const auth = useAuth();

  useEffect(() => {
    if (formState.message) {
      if (formState.success) {
        // Auto-login the user after successful sign-up
        const formData = new FormData();
        const email = (document.getElementById('email') as HTMLInputElement)?.value;
        const password = (document.getElementById('password') as HTMLInputElement)?.value;

        if (auth && email && password) {
            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    toast({
                      title: "Account Created & Logged In!",
                      description: "Welcome to ApnaBandhan.",
                    });
                    router.push('/profile');
                })
                .catch((error) => {
                     console.error("Auto-login failed:", error);
                     toast({
                       title: "Account Created!",
                       description: "Please log in to continue.",
                     });
                     router.push('/login'); // Fallback to manual login
                });
        } else {
             toast({
               title: "Account Created!",
               description: "Please log in to continue.",
             });
             router.push('/login');
        }

      } else {
        toast({
          title: 'Sign Up Failed',
          description: formState.message,
          variant: 'destructive',
        });
      }
    }
  }, [formState, toast, router, auth]);


  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4 animate-fade-in-up">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>Enter your details to get started.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form action={formAction}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="name" name="name" placeholder="Your Name" required className="pl-10" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Enter your real full name.</p>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" name="email" type="email" placeholder="m@example.com" required className="pl-10" />
                </div>
                 <p className="text-xs text-muted-foreground mt-1">Enter a valid, real email address.</p>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        className="pl-10 pr-10"
                    />
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
                 <p className="text-xs text-muted-foreground mt-1">
                      Use a strong password. Min 8 characters.
                 </p>
              </div>

               <div>
                <Label htmlFor="referralCode">Referral Code</Label>
                <div className="relative">
                    <Gift className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="referralCode" name="referralCode" placeholder="Enter referral code (optional)" defaultValue={searchParams.get('ref') || ''} className="pl-10" />
                </div>
              </div>

              <SubmitButton />
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
