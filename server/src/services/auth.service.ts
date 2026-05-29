import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/user.model';
import { sendVerificationEmail } from './email.service';
import { generateVerificationToken } from '../utils/token.utils';
import { PublicUser } from '../types';

const SALT_ROUNDS = 12;
const TOKEN_EXPIRY_HOURS = 24;

export interface SignupInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

function toPublicUser(user: IUser): PublicUser {
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

export async function signupUser(input: SignupInput): Promise<void> {
  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
  const verificationToken = generateVerificationToken();
  const expires = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  await User.create({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email.toLowerCase(),
    password: hashedPassword,
    emailVerificationToken: verificationToken,
    emailVerificationExpires: expires,
  });

  await sendVerificationEmail(input.email, input.firstName, verificationToken).catch((err) => {
    console.error('❌ Failed to send verification email:', err instanceof Error ? err.message : err);
    throw new Error('Account created but verification email could not be sent. Please contact support.');
  });
}

export async function verifyEmailToken(token: string): Promise<void> {
  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: new Date() },
  }).select('+emailVerificationToken +emailVerificationExpires');

  if (!user) {
    throw new Error('Verification link is invalid or has expired.');
  }

  user.status = 'pending_approval';
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;
  await user.save();
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function loginUser(input: LoginInput): Promise<PublicUser> {
  const user = await User.findOne({ email: input.email.toLowerCase() }).select('+password');

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const passwordMatch = await bcrypt.compare(input.password, user.password);
  if (!passwordMatch) {
    throw new Error('Invalid email or password.');
  }

  if (user.status === 'pending_email') {
    throw new Error('Please verify your email address before logging in.');
  }

  if (user.status === 'pending_approval') {
    throw new Error('Your account is awaiting admin approval.');
  }

  if (user.status === 'rejected') {
    throw new Error('Your account has been rejected. Please contact support.');
  }

  return toPublicUser(user);
}

export async function getUserById(id: string): Promise<PublicUser | null> {
  const user = await User.findById(id);
  if (!user) return null;
  return toPublicUser(user);
}
