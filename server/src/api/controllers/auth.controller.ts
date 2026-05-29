import { Request, Response } from 'express';
import { signupSchema, loginSchema } from '../validators/auth.validators';
import * as authService from '../../services/auth.service';
import { generateJwt } from '../../utils/token.utils';
import { env } from '../../config/env';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export async function signup(req: Request, res: Response): Promise<void> {
  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      success: false,
      message: result.error.issues[0].message,
    });
    return;
  }

  try {
    await authService.signupUser(result.data);
    res.status(201).json({
      success: true,
      message: 'Account created. Please check your email to verify your address.',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Signup failed.';
    res.status(400).json({ success: false, message });
  }
}

export async function verifyEmail(req: Request, res: Response): Promise<void> {
  const token = req.params.token as string;

  if (!token) {
    res.redirect(`${env.CLIENT_URL}/verify-email?error=missing_token`);
    return;
  }

  try {
    await authService.verifyEmailToken(token);
    res.redirect(`${env.CLIENT_URL}/verify-email?success=true`);
  } catch {
    res.redirect(`${env.CLIENT_URL}/verify-email?error=invalid_token`);
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      success: false,
      message: result.error.issues[0].message,
    });
    return;
  }

  try {
    const user = await authService.loginUser(result.data);
    const token = generateJwt({ userId: user.id, role: user.role });
    res.cookie('token', token, COOKIE_OPTIONS);
    res.json({ success: true, message: 'Login successful.', data: user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed.';
    res.status(401).json({ success: false, message });
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: env.NODE_ENV === 'production' });
  res.json({ success: true, message: 'Logged out successfully.' });
}

export async function me(req: Request, res: Response): Promise<void> {
  try {
    const user = await authService.getUserById(req.user!.userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }
    res.json({ success: true, message: 'OK', data: user });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch user.' });
  }
}
