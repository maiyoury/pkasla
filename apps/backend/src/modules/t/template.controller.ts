import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import { templateService } from './template.service';
import { buildSuccessResponse } from '@/helpers/http-response';
import { storageService } from '@/common/services/storage.service';
import { uploadRepository } from '@/modules/upload/upload.repository';

/**
 * Create a new template
 */
export const createTemplateHandler = async (req: Request, res: Response) => {
  let previewImageUrl: string | undefined;

  // Handle file upload if present
  if (req.file) {
    const folder = 'templates';
    const customFileName = `template-${Date.now()}-${req.file.originalname}`;
    const result = await storageService.uploadFile(req.file, folder, customFileName);

    // Save upload record to database
    if (req.user) {
      await uploadRepository.create({
        userId: req.user.id as any,
        originalFilename: req.file.originalname,
        filename: result.key.split('/').pop() || req.file.originalname,
        url: result.url,
        key: result.key,
        provider: result.provider,
        mimetype: req.file.mimetype,
        size: req.file.size,
        folder,
      });
    }

    previewImageUrl = result.url;
  } else if (req.body.previewImage) {
    // If previewImage is provided as URL string, use it
    previewImageUrl = req.body.previewImage;
  }

  const templateData = {
    ...req.body,
    previewImage: previewImageUrl,
    price: req.body.price ? Number(req.body.price) : undefined,
    isPremium: req.body.isPremium === 'true' || req.body.isPremium === true,
  };

  const template = await templateService.create(templateData);
  return res.status(httpStatus.CREATED).json(buildSuccessResponse(template, 'Template created successfully'));
};

/**
 * Get template by ID
 */
export const getTemplateHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const template = await templateService.findByIdOrFail(id);
  return res.status(httpStatus.OK).json(buildSuccessResponse(template));
};

/**
 * Update template by ID
 */
export const updateTemplateHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  let previewImageUrl: string | undefined;

  // Handle file upload if present
  if (req.file) {
    const folder = 'templates';
    const customFileName = `template-${Date.now()}-${req.file.originalname}`;
    const result = await storageService.uploadFile(req.file, folder, customFileName);

    // Save upload record to database
    if (req.user) {
      await uploadRepository.create({
        userId: req.user.id as any,
        originalFilename: req.file.originalname,
        filename: result.key.split('/').pop() || req.file.originalname,
        url: result.url,
        key: result.key,
        provider: result.provider,
        mimetype: req.file.mimetype,
        size: req.file.size,
        folder,
      });
    }

    previewImageUrl = result.url;
  } else if (req.body.previewImage) {
    // If previewImage is provided as URL string, use it
    previewImageUrl = req.body.previewImage;
  }

  const updateData: any = { ...req.body };
  if (previewImageUrl !== undefined) {
    updateData.previewImage = previewImageUrl;
  }
  if (req.body.price !== undefined) {
    updateData.price = req.body.price ? Number(req.body.price) : undefined;
  }
  if (req.body.isPremium !== undefined) {
    updateData.isPremium = req.body.isPremium === 'true' || req.body.isPremium === true;
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
  
  const result = await templateService.list(page, pageSize, filters);
  return res.status(httpStatus.OK).json(buildSuccessResponse(result));
};

/**
 * Get all unique categories
 */
export const getCategoriesHandler = async (req: Request, res: Response) => {
  const categories = await templateService.getCategories();
  return res.status(httpStatus.OK).json(buildSuccessResponse(categories));
};

