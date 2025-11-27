import { Router } from 'express';
import { asyncHandler } from '@/utils/async-handler';
import { authenticate } from '@/common/middlewares/authenticate';
import { authorize } from '@/common/middlewares/authorize';
import {
  getRevenueStatsHandler,
  getRevenueByDateRangeHandler,
} from './revenue.controller';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

router.get('/stats', asyncHandler(getRevenueStatsHandler));
router.get('/range', asyncHandler(getRevenueByDateRangeHandler));

export const revenueRouter: Router = router;

