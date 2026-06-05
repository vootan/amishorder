import { Request, Response } from 'express';
import { env } from '../../config/env';
import { User } from '../../models/user.model';
import bcrypt from 'bcryptjs';
import { generateJwt } from '../../utils/token.utils';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function devLogin(_req: Request, res: Response): Promise<void> {
  if (env.NODE_ENV === 'production') {
    res.status(404).json({ success: false, message: 'Not found.' });
    return;
  }

  const email = (env.ADMIN_EMAIL || 'dev@local').toLowerCase();
  const existing = await User.findOne({ email });

  let user = existing;
  if (!existing) {
    const password = 'devpassword';
    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({
      firstName: env.ADMIN_FIRST_NAME || 'Dev',
      lastName: env.ADMIN_LAST_NAME || 'Admin',
      email,
      password: hashed,
      role: 'admin',
      status: 'active',
      access: 'edit',
    });
  }

  const token = generateJwt({ userId: (user!._id as any).toString(), role: 'admin' });
  res.cookie('token', token, COOKIE_OPTIONS);
  res.json({ success: true, message: 'Dev login successful.', data: { email: user!.email } });
}
