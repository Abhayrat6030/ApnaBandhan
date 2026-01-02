'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect, Suspense } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, doc, getDocs, query, where, runTransaction } from 'firebase/firestore';


import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Mail, Lock, Gift, Eye, EyeOff } from 'lucide-react';
import { useAuth, useFirestore } from '@/firebase';


const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  referralCode: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function SignupFormComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const referralCode = searchParams.get('ref');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      referralCode: referralCode || '',
    },
  });

  async function onSubmit(values: FormValues) {
    if (!auth || !db) {
        toast({ title: 'Error', description: 'Firebase is not initialized. Please try again later.', variant: 'destructive'});
        return;
    }
    setIsLoading(true);

    try {
        let referrerUid: string | null = null;
        // 1. Validate referral code if provided
        if (values.referralCode) {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('referralCode', '==', values.referralCode.toUpperCase()));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                throw new Error('Invalid referral code.');
            }
            referrerUid = querySnapshot.docs[0].id;
        }

        // 2. Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const newUser = userCredential.user;
        
        // Update user profile in Auth
        await updateProfile(newUser, { displayName: values.name });

        // Ensure the referrer isn't the user themselves (edge case)
        if (referrerUid === newUser.uid) {
            referrerUid = null;
        }

        // 3. Create user profile and update referrer in a single transaction
        await runTransaction(db, async (transaction) => {
            const newUserRef = doc(db, 'users', newUser.uid);
            
            const newReferralCode = `${values.name.replace(/\s+/g, '').substring(0, 4).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;

            transaction.set(newUserRef, {
                displayName: values.name,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                referralCode: newReferralCode,
                referredBy: referrerUid,
                status: 'active',
                referredUsers: [],
            });

            // If there was a valid referrer, update their document
            if (referrerUid) {
                const referrerRef = doc(db, 'users', referrerUid);
                const referrerDoc = await transaction.get(referrerRef);
                if (referrerDoc.exists()) {
                    const referredUsers = referrerDoc.data()?.referredUsers || [];
                    transaction.update(referrerRef, {
                        referredUsers: [...referredUsers, newUser.uid]
                    });
                }
            }
        });

        toast({ title: "Account Created!", description: "Welcome to ApnaBandhan. You're now logged in." });
        router.push('/profile');

    } catch (error: any) {
        let message = 'An unknown error occurred.';
        if (error.code === 'auth/email-already-in-use') {
            message = 'This email is already in use. Please log in instead.';
        } else if (error.message === 'Invalid referral code.') {
            message = 'The referral code you entered is not valid. Please check and try again.';
        }
        console.error("Signup Error:", error);
        toast({ title: 'Sign Up Failed', description: message, variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4 animate-fade-in-up">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>Enter your details to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="name">Name</Label>
                    <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="name" placeholder="Your Name" required {...field} className="pl-10" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="email" type="email" placeholder="m@example.com" required {...field} className="pl-10" />
                    </div>
                     <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required {...field} className="pl-10 pr-10" />
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
                     <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="referralCode"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                    <div className="relative mt-1">
                        <Gift className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="referralCode" placeholder="Enter referral code" {...field} className="pl-10" />
                    </div>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </Form>
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
