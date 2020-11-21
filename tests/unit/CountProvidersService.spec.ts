import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import factory from '../utils/factory';
import CountProvidersService from '@modules/appointments/services/CountProvidersService';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

describe('CountProvidersService', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeCacheProvider: FakeCacheProvider;
  let countProviders: CountProvidersService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    countProviders = new CountProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to count providers', async () => {
    const users = await factory.attrsMany<User>('User', 3);

    const promises: Promise<User>[] = [];
    users.forEach(user => {
      promises.push(
        fakeUsersRepository.create({
          name: user.name,
          email: user.email,
          password: user.password,
        }),
      );
    });

    const [{ id }] = await Promise.all(promises);

    const count = await countProviders.execute(id);

    expect(count).toBe(2);
  });

  it('should be able to count providers from cache', async () => {
    const users = await factory.attrsMany<User>('User', 3);

    const promises: Promise<User>[] = [];
    users.forEach(user => {
      promises.push(
        fakeUsersRepository.create({
          name: user.name,
          email: user.email,
          password: user.password,
        }),
      );
    });

    const savedUsers = await Promise.all(promises);
    const [{ id }] = savedUsers;

    await fakeCacheProvider.save(
      `providers_count:${id}`,
      savedUsers.filter(user => user.id !== id).length,
    );

    const count = await countProviders.execute(id);

    expect(count).toBe(2);
  });
});
