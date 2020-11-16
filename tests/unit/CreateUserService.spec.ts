import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

describe('CreateUserService', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;
  let fakeCacheProvider: FakeCacheProvider;
  let createUser: CreateUserService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '79345794',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with an email already in use ', async () => {
    const email = 'johndoe@gmail.com';
    await createUser.execute({
      name: 'John Doe',
      email,
      password: '79345794',
    });

    await expect(
      createUser.execute({
        name: 'Jane Doe',
        email,
        password: '8927349',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
