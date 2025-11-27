import { Router } from 'express';
import { asyncHandler } from '@/utils/async-handler';
import { validateRequest } from '@/common/middlewares/validate-request';
import { authenticate } from '@/common/middlewares/authenticate';
import { createFieldsUploadMiddleware } from '@/common/middlewares/upload';
import {
  createEventHandler,
  getEventHandler,
  updateEventHandler,
  deleteEventHandler,
  listEventsHandler,
  getMyEventsHandler,
} from './event.controller';
import {
  createEventSchema,
  updateEventSchema,
  getEventSchema,
  deleteEventSchema,
  listEventsQuerySchema,
} from './event.validation';

const router = Router();

// List events with pagination and filters (public)
router.get(
  '/',
  validateRequest(listEventsQuerySchema),
  asyncHandler(listEventsHandler),
);

// Get events by current user (authenticated)
router.get(
  '/my',
  authenticate,
  asyncHandler(getMyEventsHandler),
);

// Get event by ID (public)
router.get(
  '/:id',
  validateRequest(getEventSchema),
  asyncHandler(getEventHandler),
);

// Create new event (authenticated)
router.post(
  '/',
  authenticate,
  createFieldsUploadMiddleware(['coverImage', 'khqrUsd', 'khqrKhr'], {
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    maxSize: 5 * 1024 * 1024, // 5MB
  }),
  validateRequest(createEventSchema),
  asyncHandler(createEventHandler),
);

// Update event by ID (authenticated, host only)
router.patch(
  '/:id',
  authenticate,
  createFieldsUploadMiddleware(['coverImage', 'khqrUsd', 'khqrKhr'], {
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    maxSize: 5 * 1024 * 1024, // 5MB
  }),
  validateRequest(updateEventSchema),
  asyncHandler(updateEventHandler),
);

// Delete event by ID (authenticated, host only)
router.delete(
  '/:id',
  authenticate,
  validateRequest(deleteEventSchema),
  asyncHandler(deleteEventHandler),
);

export const eventRouter: Router = router;

