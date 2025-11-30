import { Router } from 'express';
import { asyncHandler } from '@/utils/async-handler';
import { validateRequest } from '@/common/middlewares/validate-request';
import { authenticate } from '@/common/middlewares/authenticate';
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

// User-facing routes - require authentication
// List templates with pagination and filters (regular users see only published)
router.get(
  '/',
  authenticate,
  validateRequest(listTemplatesQuerySchema),
  asyncHandler(listTemplatesHandler),
);

// Get all unique categories
router.get(
  '/categories',
  authenticate,
  asyncHandler(getCategoriesHandler),
);

// Get template by ID (regular users see only published)
router.get(
  '/:id',
  authenticate,
  validateRequest(getTemplateSchema),
  asyncHandler(getTemplateHandler),
);

// Create new template
router.post(
  '/',
  validateRequest(createTemplateSchema),
  asyncHandler(createTemplateHandler),
);

// Update template by ID
router.patch(
  '/:id',
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

