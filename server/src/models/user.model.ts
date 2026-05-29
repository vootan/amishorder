import { Document, Model, Schema, model } from 'mongoose';

export type UserRole = 'admin' | 'SOResident';
export type UserAccess = 'edit' | 'view' | null;
export type UserStatus = 'pending_email' | 'pending_approval' | 'active' | 'rejected';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  access: UserAccess;
  status: UserStatus;
  emailVerificationToken: string | null;
  emailVerificationExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserModel extends Model<IUser> {}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'SOResident'], default: 'SOResident' },
    access: { type: String, enum: ['edit', 'view', null], default: null },
    status: {
      type: String,
      enum: ['pending_email', 'pending_approval', 'active', 'rejected'],
      default: 'pending_email',
    },
    emailVerificationToken: { type: String, default: null, select: false },
    emailVerificationExpires: { type: Date, default: null, select: false },
  },
  { timestamps: true },
);

export const User = model<IUser, IUserModel>('User', userSchema);
