import { Router } from 'express';
import { devLogin } from '../controllers/dev.controller';

const router = Router();

router.post('/login', devLogin);

export default router;
