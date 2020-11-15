export default interface IRateLimitProvider {
  consume(ip: string): Promise<void>;
}
