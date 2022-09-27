import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import factory from '../utils/factory';
import User from '@modules/users/infra/typeorm/entities/User';

describe('SendForgotPasswordEmail', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeMailProvider: FakeMailProvider;
  let fakeUserTokensRepository: FakeUserTokensRepository;
  let sendForgotPasswordEmail: SendForgotPasswordEmailService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover your password using your email', async () => {
    const { email, password, name } = await factory.attrs<User>('User');
    await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await sendForgotPasswordEmail.execute({
      email,
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non existing user password', async () => {
    const { email } = await factory.attrs<User>('User');
    await expect(
      sendForgotPasswordEmail.execute({
        email,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const { email, password, name } = await factory.attrs<User>('User');
    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const generate = jest.spyOn(fakeUserTokensRepository, 'generate');

    await sendForgotPasswordEmail.execute({
      email,
    });

    expect(generate).toHaveBeenCalledWith(user.id);
  });
});
