import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import factory from '../utils/factory';
import User from '@modules/users/infra/typeorm/entities/User';

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
    const { email, password, name } = await factory.attrs<User>('User');
    const user = await createUser.execute({
      name,
      email,
      password,
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with an email already in use ', async () => {
    const { email, password, name } = await factory.attrs<User>('User');

    await createUser.execute({
      name,
      email,
      password,
    });

    await expect(
      createUser.execute({
        name,
        email,
        password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
