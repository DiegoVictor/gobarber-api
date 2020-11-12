import IHashProvider from '../models/IHashProvider';

class FakeHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return payload;
  }

  public async compareHash(paylaod: string, hashed: string): Promise<boolean> {
    return paylaod === hashed;
  }
}

export default FakeHashProvider;
