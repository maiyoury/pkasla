import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { AppError } from '@/common/errors/app-error';
import {
  isMaintenanceMode,
  isRegistrationAllowed,
  isEmailVerificationRequired,
  getSetting,
} from '@/modules/settings/settings.utils';

/**
 * Middleware to check if maintenance mode is enabled
 * Allows admins to bypass maintenance mode
 */
export const checkMaintenanceMode = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const maintenanceMode = await isMaintenanceMode();
    
    if (maintenanceMode) {
      // Allow admins to bypass maintenance mode
      if (req.user?.role === 'admin') {
        return next();
      }
      
      throw new AppError(
        'System is currently under maintenance. Please try again later.',
        httpStatus.SERVICE_UNAVAILABLE
      );
    }
    
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(
      new AppError(
        'Unable to check system status',
        httpStatus.INTERNAL_SERVER_ERROR
      )
    );
  }
};

/**
 * Middleware to check if registration is allowed
 */
export const checkRegistrationAllowed = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const allowRegistration = await isRegistrationAllowed();
    
    if (!allowRegistration) {
      throw new AppError(
        'Registration is currently disabled',
        httpStatus.FORBIDDEN
      );
    }
    
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(
      new AppError(
        'Unable to check registration status',
        httpStatus.INTERNAL_SERVER_ERROR
      )
    );
  }
};

/**
 * Middleware factory to check any setting value
 * Usage: checkSetting('maintenanceMode', false) - checks that maintenanceMode is false
 */
export const checkSetting = <K extends string>(
  settingKey: K,
  expectedValue: any,
  errorMessage?: string
) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const value = await getSetting(settingKey as any);
      
      if (value !== expectedValue) {
        throw new AppError(
          errorMessage || `Setting ${settingKey} does not match required value`,
          httpStatus.FORBIDDEN
        );
      }
      
      next();
    } catch (error) {
      if (error instanceof AppError) {
        return next(error);
      }
      return next(
        new AppError(
          'Unable to check setting',
          httpStatus.INTERNAL_SERVER_ERROR
        )
      );
    }
  };
};

/**
 * Middleware to check if email verification is required
 * This is informational - actual verification should be checked in the service layer
 */
export const checkEmailVerificationRequired = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const requireEmailVerification = await isEmailVerificationRequired();
    
    // Attach to request for use in controllers/services
    req.requireEmailVerification = requireEmailVerification;
    
    next();
  } catch (error) {
    // Don't block request if we can't check, just set to false
    req.requireEmailVerification = false;
    next();
  }
};

