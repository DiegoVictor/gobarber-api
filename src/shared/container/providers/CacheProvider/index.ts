import { container } from 'tsyringe';

import ICacheProvider from './models/ICacheProvider';
import RedisCacheProvider from './implementations/RedisCacheProvider';
import FakeCacheProvider from './fakes/FakeCacheProvider';

const providers = {
  redis:
    process.env.NODE_ENV !== 'test' ? RedisCacheProvider : FakeCacheProvider,
};

container.registerSingleton<ICacheProvider>('CacheProvider', providers.redis);
