import { Router } from 'express';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import devRoutes from './dev.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
if (process.env.NODE_ENV !== 'production') {
	router.use('/dev', devRoutes);
}

export default router;
