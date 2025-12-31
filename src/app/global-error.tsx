'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <AlertTriangle className="h-12 w-12 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl">Something went wrong!</CardTitle>
                    <CardDescription>We're sorry, but an unexpected error has occurred.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {process.env.NODE_ENV === 'development' && (
                        <div className="bg-muted p-4 rounded-md text-left text-sm overflow-auto max-h-60">
                           <p className="font-bold">Error Details (Dev Mode):</p>
                           <pre className="mt-2 whitespace-pre-wrap font-mono text-xs">
                               {error.message}
                           </pre>
                        </div>
                    )}
                    <p className="text-muted-foreground">You can try to refresh the page or go back to the homepage.</p>
                    <div className="flex justify-center gap-4">
                        <Button onClick={() => reset()} variant="outline">Try Again</Button>
                        <Button asChild>
                            <Link href="/"><Home className="mr-2 h-4 w-4" /> Go Home</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </body>
    </html>
  );
}
