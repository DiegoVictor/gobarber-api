import faker from 'faker';

import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import factory from '../utils/factory';

describe('AuthenticateUserService', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;
  let authenticateUser: AuthenticateUserService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const { email, password, name } = await factory.attrs('User');

    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const response = await authenticateUser.execute({
      email,
      password,
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    const { email, password } = await factory.attrs('User');
    await expect(
      authenticateUser.execute({
        email,
        password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const { email, password, name } = await factory.attrs('User');
    const newPassword = faker.internet.password();

    await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    await expect(
      authenticateUser.execute({
        email,
        password: newPassword,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
