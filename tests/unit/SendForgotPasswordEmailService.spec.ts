import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';

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
    const email = 'johndoe@gmail.com';
    await fakeUsersRepository.create({
      name: 'John Doe',
      email,
      password: '789459349',
    });

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await sendForgotPasswordEmail.execute({
      email,
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'johndoe@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const email = 'johndoe@gmail.com';
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email,
      password: '789459349',
    });

    const generate = jest.spyOn(fakeUserTokensRepository, 'generate');

    await sendForgotPasswordEmail.execute({
      email,
    });

    expect(generate).toHaveBeenCalledWith(user.id);
  });
});
