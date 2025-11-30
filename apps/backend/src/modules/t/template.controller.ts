import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import { templateService } from './template.service';
import { buildSuccessResponse } from '@/helpers/http-response';

/**
 * Create a new template
 */
export const createTemplateHandler = async (req: Request, res: Response) => {
  const templateData = {
    ...req.body,
    previewImage: req.body.previewImage || undefined,
    price: req.body.price ? Number(req.body.price) : undefined,
    isPremium: req.body.isPremium === 'true' || req.body.isPremium === true,
    status: req.body.status || 'draft',
    slug: req.body.slug || undefined,
    variables: req.body.variables || undefined,
  };

  const template = await templateService.create(templateData);
  return res.status(httpStatus.CREATED).json(buildSuccessResponse(template, 'Template created successfully'));
};

/**
 * Get template by ID
 */
export const getTemplateHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const isAdmin = req.user?.role === 'admin';
  const template = await templateService.findByIdOrFail(id, isAdmin);
  return res.status(httpStatus.OK).json(buildSuccessResponse(template));
};

/**
 * Update template by ID
 */
export const updateTemplateHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  const updateData: any = { ...req.body };
  if (req.body.previewImage !== undefined) {
    updateData.previewImage = req.body.previewImage || undefined;
  }
  if (req.body.price !== undefined) {
    updateData.price = req.body.price ? Number(req.body.price) : undefined;
  }
  if (req.body.isPremium !== undefined) {
    updateData.isPremium = req.body.isPremium === 'true' || req.body.isPremium === true;
  }
  if (req.body.status !== undefined) {
    updateData.status = req.body.status;
  }
  if (req.body.slug !== undefined) {
    updateData.slug = req.body.slug || undefined;
  }
  if (req.body.variables !== undefined) {
    updateData.variables = req.body.variables || undefined;
  }

  const template = await templateService.updateById(id, updateData);
  return res.status(httpStatus.OK).json(buildSuccessResponse(template, 'Template updated successfully'));
};

/**
 * Delete template by ID
 */
export const deleteTemplateHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  await templateService.deleteById(id);
  return res.status(httpStatus.OK).json(buildSuccessResponse(null, 'Template deleted successfully'));
};

/**
 * List templates with pagination and filters
 */
export const listTemplatesHandler = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  
  const filters: {
    category?: string;
    isPremium?: boolean;
    search?: string;
  } = {};
  
  if (req.query.category) {
    filters.category = req.query.category as string;
  }
  
  if (req.query.isPremium !== undefined) {
    filters.isPremium = req.query.isPremium === 'true';
  }
  
  if (req.query.search) {
    filters.search = req.query.search as string;
  }
  
  // Check if user is admin
  const isAdmin = req.user?.role === 'admin';
  
  const result = await templateService.list(page, pageSize, filters, isAdmin);
  return res.status(httpStatus.OK).json(buildSuccessResponse(result));
};

/**
 * Get all unique categories
 */
export const getCategoriesHandler = async (req: Request, res: Response) => {
  const categories = await templateService.getCategories();
  return res.status(httpStatus.OK).json(buildSuccessResponse(categories));
};

