import { User, UserAccess } from '../models/user.model';
import { PublicUser } from '../types';

function toPublicUser(user: InstanceType<typeof User>): PublicUser {
  return {
    id: (user._id as { toString(): string }).toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    access: user.access,
    status: user.status,
    createdAt: user.createdAt,
  };
}

export async function listUsers(): Promise<PublicUser[]> {
  const users = await User.find({ role: 'SOResident' }).sort({ createdAt: -1 });
  return users.map(toPublicUser);
}

export async function approveUser(
  userId: string,
  access: UserAccess,
): Promise<PublicUser> {
  const user = await User.findByIdAndUpdate(
    userId,
    { status: 'active', role: 'SOResident', access },
    { returnDocument: 'after' },
  );

  if (!user) {
    throw new Error('User not found.');
  }

  return toPublicUser(user);
}

export async function rejectUser(userId: string): Promise<PublicUser> {
  const user = await User.findByIdAndUpdate(
    userId,
    { status: 'rejected' },
    { returnDocument: 'after' },
  );

  if (!user) {
    throw new Error('User not found.');
  }

  return toPublicUser(user);
}
