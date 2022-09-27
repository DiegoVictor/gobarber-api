import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import factory from '../utils/factory';
import User from '@modules/users/infra/typeorm/entities/User';

describe('UpdateUserAvatarService', () => {
  let fakeUsersRepository: FakeUsersRepository;
  let fakeStorageProvider: FakeStorageProvider;
  let updateUserAvatar: UpdateUserAvatarService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const { email, password, name } = await factory.attrs<User>('User');
    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const avatarFilename = 'avatar.jpg';
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename,
    });

    expect(user.avatar).toBe(avatarFilename);
  });

  it('should not be able to update avatar fro non existing user', async () => {
    const avatarFilename = 'avatar.jpg';

    await expect(
      updateUserAvatar.execute({
        user_id: '',
        avatarFilename,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete current avatar when updating a new one', async () => {
    const { email, password, name } = await factory.attrs<User>('User');
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name,
      email,
      password,
    });

    const avatarFilename = 'avatar.jpg';
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename,
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'another-avatar.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith(avatarFilename);
    expect(user.avatar).toBe('another-avatar.jpg');
  });
});
