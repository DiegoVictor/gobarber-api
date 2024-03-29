import { faker } from '@faker-js/faker';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import factory from '../utils/factory';
import User from '@modules/users/infra/typeorm/entities/User';

describe('UpdateProfileService', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let showProfile: ShowProfileService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show the profile', async () => {
    const { email, password, name } = await factory.attrs<User>('User');
    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const profile = await showProfile.execute({ user_id: user.id });

    expect(profile.name).toBe(name);
    expect(profile.email).toBe(email);
  });

  it('should not be able to show the profile from non existing user', async () => {
    await expect(
      showProfile.execute({ user_id: String(faker.datatype.number()) }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
