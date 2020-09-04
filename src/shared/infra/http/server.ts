import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import { errors } from 'celebrate';

import '@shared/container';
import AppError from '@shared/errors/AppError';
import uploadConfiguration from '@config/upload';
import routes from './routes';
import rateLimiter from './middlewares/RateLimiter';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/uploads', express.static(uploadConfiguration.uploadsDirectory));
app.use(rateLimiter);
app.use(routes);

app.use(errors());
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log('Server started on port 3333!');
});
