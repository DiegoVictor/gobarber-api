import { faker } from '@faker-js/faker';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import factory from '../utils/factory';
import User from '@modules/users/infra/typeorm/entities/User';

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
    const [user1, user2] = await factory.attrsMany<User>('User', 2);
    const user = await fakeUsersRepository.create({
      name: user1.name,
      email: user1.email,
      password: user1.password,
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: user2.name,
      email: user2.email,
    });

    expect(updatedUser.name).toBe(user2.name);
    expect(updatedUser.email).toBe(user2.email);
  });

  it('should not be able to change to another user email', async () => {
    const [user1, user2] = await factory.attrsMany<User>('User', 2);
    await fakeUsersRepository.create({
      name: user1.name,
      email: user1.email,
      password: user1.password,
    });

    const user = await fakeUsersRepository.create({
      name: user2.name,
      email: user2.email,
      password: user2.password,
    });

    await expect(
      updateProfile.execute({
        name: user1.name,
        user_id: user.id,
        email: user1.email,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const [user1, user2] = await factory.attrsMany<User>('User', 2);
    const user = await fakeUsersRepository.create({
      name: user1.name,
      email: user1.email,
      password: user1.password,
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: user2.name,
      email: user2.email,
      old_password: user1.password,
      password: user2.password,
    });

    expect(updatedUser.password).toBe(user2.password);
  });

  it('should not be able to update the password without old password', async () => {
    const [user1, user2] = await factory.attrsMany<User>('User', 2);
    const user = await fakeUsersRepository.create({
      name: user1.name,
      email: user1.email,
      password: user1.password,
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: user2.name,
        email: user2.email,
        password: user2.password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong password', async () => {
    const [user1, user2] = await factory.attrsMany<User>('User', 2);
    const user = await fakeUsersRepository.create({
      name: user1.name,
      email: user1.email,
      password: user1.password,
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: user2.name,
        email: user2.email,
        old_password: user2.password,
        password: user2.password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile from non existing user', async () => {
    const { name, email } = await factory.attrs<User>('User');
    await expect(
      updateProfile.execute({
        user_id: String(faker.datatype.number()),
        name,
        email,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
