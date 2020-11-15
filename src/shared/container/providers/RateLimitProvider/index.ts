import { container } from 'tsyringe';

import IRateLimitProvider from './models/IRateLimitProvider';
import RateLimitProvider from './implementations/RateLimitProvider';

container.registerInstance<IRateLimitProvider>(
  'RateLimitProvider',
  container.resolve(RateLimitProvider)
);
