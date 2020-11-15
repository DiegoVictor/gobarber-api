import IRateLimitProvider from '../models/IRateLimitProvider';

export default class FakeRateLimiterProvider implements IRateLimitProvider {
  public async consume(ip: string): Promise<void> {}
}
