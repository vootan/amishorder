import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../../utils/token.utils';
import { AuthTokenPayload } from '../../types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.token as string | undefined;

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return;
  }

  try {
    const payload = verifyJwt(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
  }
}
