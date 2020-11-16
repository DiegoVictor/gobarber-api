import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProviderService from '@modules/appointments/services/ListProviderService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

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
    const provider1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '79345794',
    });

    const provider2 = await fakeUsersRepository.create({
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: '283783',
    });

    const user = await fakeUsersRepository.create({
      name: 'Jess Doe',
      email: 'jessdoe@gmail.com',
      password: '389754835',
    });

    const providers = await listProviders.execute({ user_id: user.id });

    expect(providers).toStrictEqual([provider1, provider2]);
  });
});
