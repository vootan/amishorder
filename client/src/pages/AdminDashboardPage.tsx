import Navbar from '@/components/common/Navbar';
import UserTable from '@/features/admin/components/UserTable';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">
            Review pending accounts and assign access levels.
          </p>
        </div>
        <UserTable />
      </div>
    </div>
  );
}
