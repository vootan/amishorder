import { useState } from 'react';
import { useAdminUsers } from '../hooks/useAdminUsers';
import type { UserAccess } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const STATUS_COLORS: Record<string, string> = {
  pending_email: 'bg-yellow-100 text-yellow-800',
  pending_approval: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function UserTable() {
  const { users, isLoading, actionLoading, handleApprove, handleReject } = useAdminUsers();
  const [selectedAccess, setSelectedAccess] = useState<Record<string, UserAccess>>({});

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No users found.
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Access</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell className="text-gray-600">{user.email}</TableCell>
              <TableCell>
                <Badge variant="secondary">{user.role}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={STATUS_COLORS[user.status] ?? ''} variant="outline">
                  {user.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                {user.access ? (
                  <Badge variant="secondary">{user.access}</Badge>
                ) : (
                  <span className="text-gray-400 text-sm">—</span>
                )}
              </TableCell>
              <TableCell className="text-gray-500 text-sm">
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                {user.status === 'pending_approval' && (
                  <div className="flex items-center justify-end gap-2">
                    <Select
                      value={selectedAccess[user.id] ?? ''}
                      onValueChange={(val) =>
                        setSelectedAccess((prev) => ({
                          ...prev,
                          [user.id]: val as UserAccess,
                        }))
                      }
                    >
                      <SelectTrigger className="w-28 h-8 text-sm">
                        <SelectValue placeholder="Access" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="edit">Edit</SelectItem>
                        <SelectItem value="view">View</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white h-8"
                      disabled={actionLoading === user.id || !selectedAccess[user.id]}
                      onClick={() => handleApprove(user.id, selectedAccess[user.id] ?? null)}
                    >
                      {actionLoading === user.id ? '…' : 'Approve'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8"
                      disabled={actionLoading === user.id}
                      onClick={() => handleReject(user.id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
