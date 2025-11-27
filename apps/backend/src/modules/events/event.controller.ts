import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import { eventService } from './event.service';
import { buildSuccessResponse } from '@/helpers/http-response';
import { storageService } from '@/common/services/storage.service';
import { uploadRepository } from '@/modules/upload/upload.repository';

/**
 * Create a new event
 */
export const createEventHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Authentication required' });
  }

  let coverImageUrl: string | undefined;
  let khqrUsdUrl: string | undefined;
  let khqrKhrUrl: string | undefined;

  // Handle file uploads if present
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  
  if (files?.coverImage?.[0]) {
    const file = files.coverImage[0];
    const folder = 'events';
    const customFileName = `cover-${Date.now()}-${file.originalname}`;
    const result = await storageService.uploadFile(file, folder, customFileName);

    if (req.user) {
      await uploadRepository.create({
        userId: req.user.id as any,
        originalFilename: file.originalname,
        filename: result.key.split('/').pop() || file.originalname,
        url: result.url,
        key: result.key,
        provider: result.provider,
        mimetype: file.mimetype,
        size: file.size,
        folder,
      });
    }

    coverImageUrl = result.url;
  } else if (req.body.coverImage) {
    coverImageUrl = req.body.coverImage;
  }

  if (files?.khqrUsd?.[0]) {
    const file = files.khqrUsd[0];
    const folder = 'events';
    const customFileName = `khqr-usd-${Date.now()}-${file.originalname}`;
    const result = await storageService.uploadFile(file, folder, customFileName);

    if (req.user) {
      await uploadRepository.create({
        userId: req.user.id as any,
        originalFilename: file.originalname,
        filename: result.key.split('/').pop() || file.originalname,
        url: result.url,
        key: result.key,
        provider: result.provider,
        mimetype: file.mimetype,
        size: file.size,
        folder,
      });
    }

    khqrUsdUrl = result.url;
  } else if (req.body.khqrUsd) {
    khqrUsdUrl = req.body.khqrUsd;
  }

  if (files?.khqrKhr?.[0]) {
    const file = files.khqrKhr[0];
    const folder = 'events';
    const customFileName = `khqr-khr-${Date.now()}-${file.originalname}`;
    const result = await storageService.uploadFile(file, folder, customFileName);

    if (req.user) {
      await uploadRepository.create({
        userId: req.user.id as any,
        originalFilename: file.originalname,
        filename: result.key.split('/').pop() || file.originalname,
        url: result.url,
        key: result.key,
        provider: result.provider,
        mimetype: file.mimetype,
        size: file.size,
        folder,
      });
    }

    khqrKhrUrl = result.url;
  } else if (req.body.khqrKhr) {
    khqrKhrUrl = req.body.khqrKhr;
  }

  const eventData = {
    ...req.body,
    hostId: req.user.id,
    coverImage: coverImageUrl,
    khqrUsd: khqrUsdUrl,
    khqrKhr: khqrKhrUrl,
    restrictDuplicateNames: req.body.restrictDuplicateNames === 'true' || req.body.restrictDuplicateNames === true,
  };

  const event = await eventService.create(eventData);
  return res.status(httpStatus.CREATED).json(buildSuccessResponse(event, 'Event created successfully'));
};

/**
 * Get event by ID
 */
export const getEventHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const event = await eventService.findByIdOrFail(id);
  return res.status(httpStatus.OK).json(buildSuccessResponse(event));
};

/**
 * Update event by ID
 */
export const updateEventHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Authentication required' });
  }

  const { id } = req.params;
  let coverImageUrl: string | undefined;
  let khqrUsdUrl: string | undefined;
  let khqrKhrUrl: string | undefined;

  // Handle file uploads if present
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  
  if (files?.coverImage?.[0]) {
    const file = files.coverImage[0];
    const folder = 'events';
    const customFileName = `cover-${Date.now()}-${file.originalname}`;
    const result = await storageService.uploadFile(file, folder, customFileName);

    if (req.user) {
      await uploadRepository.create({
        userId: req.user.id as any,
        originalFilename: file.originalname,
        filename: result.key.split('/').pop() || file.originalname,
        url: result.url,
        key: result.key,
        provider: result.provider,
        mimetype: file.mimetype,
        size: file.size,
        folder,
      });
    }

    coverImageUrl = result.url;
  } else if (req.body.coverImage !== undefined) {
    coverImageUrl = req.body.coverImage || undefined;
  }

  if (files?.khqrUsd?.[0]) {
    const file = files.khqrUsd[0];
    const folder = 'events';
    const customFileName = `khqr-usd-${Date.now()}-${file.originalname}`;
    const result = await storageService.uploadFile(file, folder, customFileName);

    if (req.user) {
      await uploadRepository.create({
        userId: req.user.id as any,
        originalFilename: file.originalname,
        filename: result.key.split('/').pop() || file.originalname,
        url: result.url,
        key: result.key,
        provider: result.provider,
        mimetype: file.mimetype,
        size: file.size,
        folder,
      });
    }

    khqrUsdUrl = result.url;
  } else if (req.body.khqrUsd !== undefined) {
    khqrUsdUrl = req.body.khqrUsd || undefined;
  }

  if (files?.khqrKhr?.[0]) {
    const file = files.khqrKhr[0];
    const folder = 'events';
    const customFileName = `khqr-khr-${Date.now()}-${file.originalname}`;
    const result = await storageService.uploadFile(file, folder, customFileName);

    if (req.user) {
      await uploadRepository.create({
        userId: req.user.id as any,
        originalFilename: file.originalname,
        filename: result.key.split('/').pop() || file.originalname,
        url: result.url,
        key: result.key,
        provider: result.provider,
        mimetype: file.mimetype,
        size: file.size,
        folder,
      });
    }

    khqrKhrUrl = result.url;
  } else if (req.body.khqrKhr !== undefined) {
    khqrKhrUrl = req.body.khqrKhr || undefined;
  }

  const updateData: any = { ...req.body };
  if (coverImageUrl !== undefined) {
    updateData.coverImage = coverImageUrl;
  }
  if (khqrUsdUrl !== undefined) {
    updateData.khqrUsd = khqrUsdUrl;
  }
  if (khqrKhrUrl !== undefined) {
    updateData.khqrKhr = khqrKhrUrl;
  }
  if (req.body.restrictDuplicateNames !== undefined) {
    updateData.restrictDuplicateNames = req.body.restrictDuplicateNames === 'true' || req.body.restrictDuplicateNames === true;
  }

  const event = await eventService.updateById(id, updateData, req.user.id);
  return res.status(httpStatus.OK).json(buildSuccessResponse(event, 'Event updated successfully'));
};

/**
 * Delete event by ID
 */
export const deleteEventHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Authentication required' });
  }

  const { id } = req.params;
  await eventService.deleteById(id, req.user.id);
  return res.status(httpStatus.OK).json(buildSuccessResponse(null, 'Event deleted successfully'));
};

/**
 * List events with pagination and filters
 */
export const listEventsHandler = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  
  const filters: {
    hostId?: string;
    status?: string;
    eventType?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {};
  
  if (req.query.hostId) {
    filters.hostId = req.query.hostId as string;
  }
  
  if (req.query.status) {
    filters.status = req.query.status as string;
  }
  
  if (req.query.eventType) {
    filters.eventType = req.query.eventType as string;
  }
  
  if (req.query.search) {
    filters.search = req.query.search as string;
  }

  if (req.query.dateFrom) {
    filters.dateFrom = req.query.dateFrom as string;
  }

  if (req.query.dateTo) {
    filters.dateTo = req.query.dateTo as string;
  }
  
  const result = await eventService.list(page, pageSize, filters);
  return res.status(httpStatus.OK).json(buildSuccessResponse(result));
};

/**
 * Get events by current user (host)
 */
export const getMyEventsHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Authentication required' });
  }

  const events = await eventService.findByHostId(req.user.id);
  return res.status(httpStatus.OK).json(buildSuccessResponse(events));
};

