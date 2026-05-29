import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg text-center">
        <CardHeader className="pb-2">
          <div className="text-5xl mb-4">⏳</div>
          <CardTitle className="text-2xl font-bold">Awaiting approval</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Your account is pending admin review. You'll be able to sign in once an
            administrator approves your request and assigns your access level.
          </p>
          <p className="text-sm text-gray-500">
            This process typically takes up to 24 hours. No further action is needed from you.
          </p>
          <Link to="/login" className={cn(buttonVariants({ variant: 'outline' }), 'w-full text-center')}>
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
