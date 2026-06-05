import Navbar from '@/components/common/Navbar';
import UserTable from '@/features/admin/components/UserTable';
import InventoryTable from '@/features/admin/components/InventoryTable';
import InventoryForm from '@/features/admin/components/InventoryForm';
import { useState } from 'react';

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<'users' | 'inventory'>('inventory');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage users, inventory and other admin settings.</p>
          </div>
          <div className="flex gap-2">
            <button className={`px-3 py-1 rounded ${tab === 'inventory' ? 'bg-indigo-600 text-white' : 'bg-white border'}`} onClick={() => setTab('inventory')}>Inventory</button>
            <button className={`px-3 py-1 rounded ${tab === 'users' ? 'bg-indigo-600 text-white' : 'bg-white border'}`} onClick={() => setTab('users')}>Users</button>
          </div>
        </div>

        {tab === 'users' && (
          <div>
            <UserTable />
          </div>
        )}

        {tab === 'inventory' && (
          <div className="grid grid-cols-1 gap-6">
            <InventoryForm />
            <InventoryTable />
          </div>
        )}
      </div>
    </div>
  );
}
