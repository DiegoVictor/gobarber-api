import { hash, compare } from 'bcryptjs';

import IHashProvider from '../models/IHashProvider';

class BCryptHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8);
  }

  public async compareHash(paylaod: string, hashed: string): Promise<boolean> {
    return compare(paylaod, hashed);
  }
}

export default BCryptHashProvider;
