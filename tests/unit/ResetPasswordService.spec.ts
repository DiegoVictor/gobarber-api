import faker from 'faker';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import AppError from '@shared/errors/AppError';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import factory from '../utils/factory';

describe('ResetPassowrd', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeUserTokensRepository: FakeUserTokensRepository;
  let fakeHashProvider: FakeHashProvider;
  let resetPassword: ResetPasswordService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const { email, password, name } = await factory.attrs('User');
    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const newPassword = String(faker.datatype.number());
    await resetPassword.execute({
      password: newPassword,
      token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(updatedUser?.password).toBe(newPassword);
    expect(generateHash).toHaveBeenCalledWith(newPassword);
  });

  it('should not be able to reset a password with non existing token', async () => {
    const token = faker.random.alphaNumeric(16);
    const password = faker.internet.password();

    await expect(
      resetPassword.execute({
        token,
        password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset a password with non existing user', async () => {
    const id = String(faker.datatype.number());
    const { token } = await fakeUserTokensRepository.generate(id);
    const password = faker.internet.password();

    await expect(
      resetPassword.execute({
        token,
        password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password if it expires', async () => {
    const { email, password, name } = await factory.attrs('User');
    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        password,
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
