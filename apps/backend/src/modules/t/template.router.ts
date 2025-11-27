import { Router } from 'express';
import { asyncHandler } from '@/utils/async-handler';
import { validateRequest } from '@/common/middlewares/validate-request';
import { createUploadMiddleware } from '@/common/middlewares/upload';
import {
  createTemplateHandler,
  getTemplateHandler,
  updateTemplateHandler,
  deleteTemplateHandler,
  listTemplatesHandler,
  getCategoriesHandler,
} from './template.controller';
import {
  createTemplateSchema,
  updateTemplateSchema,
  getTemplateSchema,
  deleteTemplateSchema,
  listTemplatesQuerySchema,
} from './template.validation';

const router = Router();

// List templates with pagination and filters
router.get(
  '/',
  validateRequest(listTemplatesQuerySchema),
  asyncHandler(listTemplatesHandler),
);

// Get all unique categories
router.get(
  '/categories',
  asyncHandler(getCategoriesHandler),
);

// Get template by ID
router.get(
  '/:id',
  validateRequest(getTemplateSchema),
  asyncHandler(getTemplateHandler),
);

// Create new template (with optional file upload)
router.post(
  '/',
  createUploadMiddleware('previewImage', {
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    maxSize: 5 * 1024 * 1024, // 5MB
  }),
  validateRequest(createTemplateSchema),
  asyncHandler(createTemplateHandler),
);

// Update template by ID (with optional file upload)
router.patch(
  '/:id',
  createUploadMiddleware('previewImage', {
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    maxSize: 5 * 1024 * 1024, // 5MB
  }),
  validateRequest(updateTemplateSchema),
  asyncHandler(updateTemplateHandler),
);

// Delete template by ID
router.delete(
  '/:id',
  validateRequest(deleteTemplateSchema),
  asyncHandler(deleteTemplateHandler),
);

export const templateRouter: Router = router;

