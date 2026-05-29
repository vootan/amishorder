import SignupForm from '@/features/auth/components/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">P1</span>
          </div>
          <p className="text-gray-500 text-sm">Phase 1 Application</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
