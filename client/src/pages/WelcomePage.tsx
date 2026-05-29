import { useAuth } from '@/providers/AuthProvider';
import Navbar from '@/components/common/Navbar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WelcomePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-6 py-16 flex items-center justify-center">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-indigo-600">
                {user.firstName[0]}{user.lastName[0]}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user.firstName}!
            </h1>
            <p className="text-gray-500 mt-2">You have successfully logged in.</p>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-700">
                Account details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Full name</span>
                <span className="text-sm font-medium">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Role</span>
                <Badge
                  variant="secondary"
                  className={
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }
                >
                  {user.role}
                </Badge>
              </div>
              {user.access && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500">Access level</span>
                  <Badge
                    variant="outline"
                    className={
                      user.access === 'edit'
                        ? 'border-green-400 text-green-700'
                        : 'border-gray-400 text-gray-600'
                    }
                  >
                    {user.access}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
