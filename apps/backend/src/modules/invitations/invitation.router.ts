import { Router } from 'express';
import { asyncHandler } from '@/utils/async-handler';
import { validateRequest } from '@/common/middlewares/validate-request';
import { authenticate } from '@/common/middlewares/authenticate';
import {
  createInvitationHandler,
  getInvitationHandler,
  updateInvitationStatusHandler,
  deleteInvitationHandler,
  listInvitationsHandler,
  getInvitationsByEventHandler,
  getMyInvitationsHandler,
} from './invitation.controller';
import {
  createInvitationSchema,
  updateInvitationStatusSchema,
  getInvitationSchema,
  deleteInvitationSchema,
  listInvitationsQuerySchema,
} from './invitation.validation';

const router = Router();

// List invitations with pagination and filters
router.get(
  '/',
  validateRequest(listInvitationsQuerySchema),
  asyncHandler(listInvitationsHandler),
);

// Get invitations by current user (authenticated)
router.get(
  '/my',
  authenticate,
  asyncHandler(getMyInvitationsHandler),
);

// Get invitations by event ID
router.get(
  '/event/:eventId',
  asyncHandler(getInvitationsByEventHandler),
);

// Get invitation by ID
router.get(
  '/:id',
  validateRequest(getInvitationSchema),
  asyncHandler(getInvitationHandler),
);

// Create new invitation request (authenticated)
router.post(
  '/',
  authenticate,
  validateRequest(createInvitationSchema),
  asyncHandler(createInvitationHandler),
);

// Update invitation status (approve/decline) (authenticated, host only)
router.patch(
  '/:id/status',
  authenticate,
  validateRequest(updateInvitationStatusSchema),
  asyncHandler(updateInvitationStatusHandler),
);

// Delete invitation by ID (authenticated)
router.delete(
  '/:id',
  authenticate,
  validateRequest(deleteInvitationSchema),
  asyncHandler(deleteInvitationHandler),
);

export const invitationRouter: Router = router;

