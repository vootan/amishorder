import { Router } from 'express';
import { listUsers, approveUser, rejectUser } from '../controllers/admin.controller';
import {
	listInventory,
	createInventoryItem,
	addPricing,
	getInventoryItem,
	softDeleteInventoryItem,
	hardDeletePricing,
} from '../controllers/inventory.controller';
import { authenticate } from '../middlewares/authenticate';
import { authorizeAdmin } from '../middlewares/authorize';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/users', listUsers);
router.put('/users/:id/approve', approveUser);
router.put('/users/:id/reject', rejectUser);

// Inventory management (admin-only)
router.get('/inventory', listInventory);
router.post('/inventory', createInventoryItem);
router.get('/inventory/:id', getInventoryItem);
router.post('/inventory/:id/pricing', addPricing);
router.delete('/inventory/:id', softDeleteInventoryItem);
router.delete('/inventory/:id/pricing/:pricingId', hardDeletePricing);

export default router;
