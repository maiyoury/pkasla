import { Router } from 'express';
import { asyncHandler } from '@/utils/async-handler';
import { authenticate } from '@/common/middlewares/authenticate';
import { authorize } from '@/common/middlewares/authorize';
import { validateRequest } from '@/common/middlewares/validate-request';
import {
  getCurrentUserHandler,
  listUsersHandler,
  updateCurrentUserHandler,
} from './user.controller';
import { updateProfileSchema, listUsersQuerySchema } from './user.validation';

const router = Router();

router.get('/me', authenticate, asyncHandler(getCurrentUserHandler));
router.patch(
  '/me',
  authenticate,
  validateRequest(updateProfileSchema),
  asyncHandler(updateCurrentUserHandler),
);

router.get(
  '/',
  authenticate,
  authorize('admin'),
  validateRequest(listUsersQuerySchema),
  asyncHandler(listUsersHandler),
);

export const userRouter: Router = router;

