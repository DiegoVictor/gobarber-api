import 'dotenv/config';
import Express from 'express';
import path from 'path';
import * as Sentry from '@sentry/node';
import Youch from 'youch';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import redis from 'redis';
import Limit from 'express-rate-limit';
import LimitRedis from 'rate-limit-redis';
import sentry from './config/sentry';
import routes from './routes';

import './database';
import HttpError from './lib/HttpError';

class App {
  constructor() {
    this.server = Express();

    Sentry.init(sentry);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(helmet());
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(
      cors({
        origin: process.env.APP_URL,
      })
    );
    this.server.use(Express.json());
    this.server.use(
      '/files',
      Express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );

    if (process.env.NODE_ENV !== 'development') {
      this.server.use(
        new Limit({
          store: new LimitRedis({
            client: redis.createClient({
              host: process.env.REDIS_HOST,
              port: process.env.REDIS_PORT,
            }),
          }),
          windowMs: 1000 * 60 * 15,
          max: 100,
        })
      );
    }
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        switch (true) {
          case err instanceof HttpError:
            return res.status(err.code).json(errors);

          default:
            return res.status(500).json(errors);
        }
      }

      return res.status(500).json({
        error: 'Internal server error',
      });
    });
  }
}

export default new App().server;
