import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import AppError from '@shared/errors/AppError';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

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
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '789459349',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const password = '7823832';
    await resetPassword.execute({
      password,
      token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(updatedUser?.password).toBe(password);
    expect(generateHash).toHaveBeenCalledWith(password);
  });

  it('should not be able to reset a password with non existing token', async () => {
    await expect(
      resetPassword.execute({
        token: '7234579848',
        password: '85985',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset a password with non existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate('287648');
    await expect(
      resetPassword.execute({
        token,
        password: '85985',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password if it expires', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '789459349',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    const password = '7823832';
    await expect(
      resetPassword.execute({
        password,
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
