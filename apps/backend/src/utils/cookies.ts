import type { Request, Response } from 'express';
import { env } from '@/config/environment';

const ACCESS_TOKEN_COOKIE = 'accessToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken';

// Cookie options for HTTP-only cookies
const getCookieOptions = (maxAge?: number) => ({
  httpOnly: true,
  secure: env.isProduction, // HTTPS only in production
  sameSite: env.isProduction ? ('strict' as const) : ('lax' as const),
  path: '/',
  maxAge: maxAge || 7 * 24 * 60 * 60 * 1000, // Default 7 days
});

// Parse JWT expiresIn string to milliseconds
const parseExpiresIn = (expiresIn: string): number => {
  const match = expiresIn.match(/(\d+)([smhd])/);
  if (!match) {
    return 15 * 60 * 1000; // Default 15 minutes
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];
  let milliseconds = value;

  switch (unit) {
    case 's':
      milliseconds *= 1000;
      break;
    case 'm':
      milliseconds *= 60 * 1000;
      break;
    case 'h':
      milliseconds *= 60 * 60 * 1000;
      break;
    case 'd':
      milliseconds *= 24 * 60 * 60 * 1000;
      break;
  }

  return milliseconds;
};

/**
 * Set access token as HTTP-only cookie
 */
export const setAccessTokenCookie = (res: Response, token: string) => {
  const maxAge = parseExpiresIn(env.jwt.accessExpiresIn);
  res.cookie(ACCESS_TOKEN_COOKIE, token, getCookieOptions(maxAge));
};

/**
 * Set refresh token as HTTP-only cookie
 */
export const setRefreshTokenCookie = (res: Response, token: string) => {
  const maxAge = parseExpiresIn(env.jwt.refreshExpiresIn);
  res.cookie(REFRESH_TOKEN_COOKIE, token, getCookieOptions(maxAge));
};

/**
 * Set both access and refresh tokens as HTTP-only cookies
 */
export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);
};

/**
 * Clear authentication cookies
 */
export const clearAuthCookies = (res: Response) => {
  res.clearCookie(ACCESS_TOKEN_COOKIE, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'strict' : 'lax',
    path: '/',
  });
  res.clearCookie(REFRESH_TOKEN_COOKIE, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'strict' : 'lax',
    path: '/',
  });
};

/**
 * Get access token from cookies
 */
export const getAccessTokenFromCookie = (req: Request): string | undefined => {
  return req.cookies?.[ACCESS_TOKEN_COOKIE];
};

/**
 * Get refresh token from cookies
 */
export const getRefreshTokenFromCookie = (req: Request): string | undefined => {
  return req.cookies?.[REFRESH_TOKEN_COOKIE];
};

