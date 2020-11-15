import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from 'redis';

export default class RateLimitProvider {
  private limiter: RateLimiterRedis;

  constructor() {
    const redisClient = redis.createClient({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });

    this.limiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: 'ratelimit',
      points: 5,
      duration: 1,
    });
  }

  public async consume(ip: string) {
    await this.limiter.consume(ip);
  }
}
