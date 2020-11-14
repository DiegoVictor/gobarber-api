import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from './UpdateUserAvatarService';

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
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '79345794',
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
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '79345794',
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
