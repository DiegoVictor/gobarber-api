import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

describe('UpdateProfileService', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeHashProvider: FakeHashProvider;
  let updateProfile: UpdateProfileService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '79345794',
    });

    const name = 'Jane Doe';
    const email = 'janedoe@gmail.com';
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name,
      email,
    });

    expect(updatedUser.name).toBe(name);
    expect(updatedUser.email).toBe(email);
  });

  it('should not be able to change to another user email', async () => {
    const email = 'johndoe@gmail.com';
    await fakeUsersRepository.create({
      name: 'John Doe',
      email,
      password: '79345794',
    });

    const user = await fakeUsersRepository.create({
      name: 'Jane Doe',
      email: 'janedoe@gmail.com',
      password: '97347954',
    });

    await expect(
      updateProfile.execute({
        name: 'Jonh Doe',
        user_id: user.id,
        email,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const password = '79345794';
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password,
    });

    const name = 'Jane Doe';
    const email = 'janedoe@gmail.com';
    const new_password = '238742378';
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name,
      email,
      old_password: password,
      password: new_password,
    });

    expect(updatedUser.password).toBe(new_password);
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '79345794',
    });

    const name = 'Jane Doe';
    const email = 'janedoe@gmail.com';
    const new_password = '238742378';

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name,
        email,
        password: new_password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '79345794',
    });

    const name = 'Jane Doe';
    const email = 'janedoe@gmail.com';
    const new_password = '238742378';

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name,
        email,
        old_password: '289792',
        password: new_password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile from non existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: '3874548',
        name: 'John Doe',
        email: 'johndoe@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
