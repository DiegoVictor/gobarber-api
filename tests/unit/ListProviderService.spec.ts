import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProviderService from '@modules/appointments/services/ListProviderService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import factory from '../utils/factory';

interface User {
  name: string;
  email: string;
  password: string;
}

describe('UpdateProfileService', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeCacheProvider: FakeCacheProvider;
  let listProviders: ListProviderService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviders = new ListProviderService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the providers', async () => {
    const [user1, user2, user3] = await factory.attrsMany('User', 3);
    const provider1 = await fakeUsersRepository.create({
      name: user1.name,
      email: user1.email,
      password: user1.password,
    });

    const provider2 = await fakeUsersRepository.create({
      name: user2.name,
      email: user2.email,
      password: user2.password,
    });

    const user = await fakeUsersRepository.create({
      name: user3.name,
      email: user3.email,
      password: user3.password,
    });

    const providers = await listProviders.execute({
      user_id: user.id,
      take: 30,
      page: 1,
    });

    expect(providers).toStrictEqual([provider1, provider2]);
  });

  it('should be able to list the providers from cache', async () => {
    const [user1, ...users] = await factory.attrsMany('User', 3);

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
    const savedProviders = await Promise.all(promises);

    const user = await fakeUsersRepository.create({
      name: user1.name,
      email: user1.email,
      password: user1.password,
    });

    const page = 1;
    await fakeCacheProvider.save(
      `providers_list:${user.id}:${page}`,
      savedProviders,
    );

    const providers = await listProviders.execute({
      user_id: user.id,
      take: 30,
      page,
    });

    savedProviders.forEach(provider => {
      expect(providers).toContainEqual({
        ...provider,
      });
    });
  });
});
