import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import { revenueService } from './revenue.service';
import { buildSuccessResponse } from '@/helpers/http-response';

/**
 * Get comprehensive revenue statistics (Admin only)
 */
export const getRevenueStatsHandler = async (req: Request, res: Response) => {
  const stats = await revenueService.getRevenueStats();
  return res.status(httpStatus.OK).json(buildSuccessResponse(stats));
};

/**
 * Get revenue by date range (Admin only)
 */
export const getRevenueByDateRangeHandler = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: 'startDate and endDate query parameters are required',
    });
  }

  const start = new Date(startDate as string);
  const end = new Date(endDate as string);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(httpStatus.BAD_REQUEST).json({
      error: 'Invalid date format',
    });
  }

  const revenue = await revenueService.getRevenueByDateRange(start, end);
  return res.status(httpStatus.OK).json(buildSuccessResponse(revenue));
};

