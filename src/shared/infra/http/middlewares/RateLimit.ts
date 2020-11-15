import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IRateLimitProvider from '@shared/container/providers/RateLimitProvider/models/IRateLimitProvider';

const rateLimitProvider: IRateLimitProvider = container.resolve(
  'RateLimitProvider'
);

export default async function rateLimiter(
  request: Request,
  _: Response,
  next: NextFunction
): Promise<void> {
  try {
    await rateLimitProvider.consume(request.ip);
    return next();
  } catch (err) {
    throw new AppError('Too many requests', 429);
  }
}
