import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfiguration from '@config/auth';
import AppError from '@shared/errors/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const { authorization } = request.headers;

  if (!authorization) {
    throw new AppError('Missing JWT token');
  }

  const [, token] = authorization.split(' ');

  try {
    const decoded = verify(token, authConfiguration.jwt.secret);
    const { sub } = decoded as TokenPayload;

    request.user = { id: sub };

    return next();
  } catch (err) {
    throw new AppError('JWT token invalid or expired');
  }
}
