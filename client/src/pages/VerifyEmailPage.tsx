import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type VerifyState = 'loading' | 'success' | 'error';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<VerifyState>('loading');

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success === 'true') {
      setState('success');
    } else if (error) {
      setState('error');
    } else {
      setState('error');
    }
  }, [searchParams]);

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg text-center">
        <CardHeader className="pb-2">
          <div className="text-5xl mb-4">{state === 'success' ? '✅' : '❌'}</div>
          <CardTitle className="text-2xl font-bold">
            {state === 'success' ? 'Email verified!' : 'Verification failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            {state === 'success'
              ? 'Your email has been verified. Your account is now pending admin approval. You will be able to log in once an admin reviews your request.'
              : 'This verification link is invalid or has expired. Please sign up again or contact support.'}
          </p>
          <Link to="/login" className={cn(buttonVariants(), 'w-full text-center')}>
            Go to sign in
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
