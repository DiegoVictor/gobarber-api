import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import ShowProfileService from '@modules/users/services/ShowProfileService';

describe('UpdateProfileService', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let showProfile: ShowProfileService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show the profile', async () => {
    const name = 'John Doe';
    const email = 'johndoe@gmail.com';
    const user = await fakeUsersRepository.create({
      name,
      email,
      password: '79345794',
    });

    const profile = await showProfile.execute({ user_id: user.id });

    expect(profile.name).toBe(name);
    expect(profile.email).toBe(email);
  });

  it('should not be able to show the profile from non existing user', async () => {
    await expect(
      showProfile.execute({ user_id: '3874548' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
