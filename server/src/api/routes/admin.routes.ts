import { Router } from 'express';
import { listUsers, approveUser, rejectUser } from '../controllers/admin.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorizeAdmin } from '../middlewares/authorize';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/users', listUsers);
router.put('/users/:id/approve', approveUser);
router.put('/users/:id/reject', rejectUser);

export default router;
