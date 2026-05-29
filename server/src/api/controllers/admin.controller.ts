import { Request, Response } from 'express';
import { approveUserSchema } from '../validators/admin.validators';
import * as adminService from '../../services/admin.service';

export async function listUsers(_req: Request, res: Response): Promise<void> {
  try {
    const users = await adminService.listUsers();
    res.json({ success: true, message: 'OK', data: users });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
}

export async function approveUser(req: Request, res: Response): Promise<void> {
  const result = approveUserSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      success: false,
      message: result.error.issues[0].message,
    });
    return;
  }

  try {
    const userId = req.params['id'] as string;
    const user = await adminService.approveUser(userId, result.data.access);
    res.json({ success: true, message: 'User approved.', data: user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Approval failed.';
    res.status(400).json({ success: false, message });
  }
}

export async function rejectUser(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.params['id'] as string;
    const user = await adminService.rejectUser(userId);
    res.json({ success: true, message: 'User rejected.', data: user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Rejection failed.';
    res.status(400).json({ success: false, message });
  }
}
