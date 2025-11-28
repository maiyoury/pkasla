import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { verifyAccessToken } from '@/utils/jwt';
import { userService } from '@/modules/users/user.service';
import { AppError } from '@/common/errors/app-error';
import { TokenBlacklistModel } from '@/modules/auth/token-blacklist.model';
import { getAccessTokenFromCookie } from '@/utils/cookies';

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    // Check session first (preferred for 2FA-enabled users)
    if (req.session?.authenticated && req.session?.userId) {
      const user = await userService.findById(req.session.userId);
      if (!user) {
        throw new AppError('Account not found', httpStatus.UNAUTHORIZED);
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      return next();
    }

    // Try to get token from HTTP-only cookie (preferred)
    let token = getAccessTokenFromCookie(req);

    // Fallback to Authorization header (for backward compatibility)
    if (!token) {
      const header = req.headers.authorization;
      if (!header || !header.startsWith('Bearer ')) {
        throw new AppError('Authentication required', httpStatus.UNAUTHORIZED);
      }
      token = header.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Authentication required', httpStatus.UNAUTHORIZED);
    }
    
    // Check if token is blacklisted
    const isBlacklisted = await TokenBlacklistModel.findOne({ token });
    if (isBlacklisted) {
      throw new AppError('Token has been revoked', httpStatus.UNAUTHORIZED);
    }

    const payload = verifyAccessToken(token);
    const user = await userService.findById(payload.sub);

    if (!user) {
      throw new AppError('Account not found', httpStatus.UNAUTHORIZED);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError('Invalid or expired token', httpStatus.UNAUTHORIZED));
  }
};

