import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function EmailSentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg text-center">
        <CardHeader className="pb-2">
          <div className="text-5xl mb-4">📬</div>
          <CardTitle className="text-2xl font-bold">Check your inbox</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            We've sent you a verification email. Click the link inside to confirm your
            email address and continue.
          </p>
          <p className="text-sm text-gray-500">
            The link expires in 24 hours. If you don't see the email, check your spam folder.
          </p>
          <Link to="/login" className={cn(buttonVariants({ variant: 'outline' }), 'w-full text-center')}>
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
