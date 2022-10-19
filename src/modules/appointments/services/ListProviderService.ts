import { injectable, inject } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  user_id: string;
  page: number;
  take: number;
}

@injectable()
class ListProviderService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id, page, take }: IRequest): Promise<User[]> {
    let users = await this.cacheProvider.recover<User[]>(
      `providers_list:${user_id}:${page}`,
    );

    if (!users) {
      users = await this.usersRepository.findAllProviders({
        except_user_id: user_id,
        page,
        take,
      });

      await this.cacheProvider.save(
        `providers_list:${user_id}:${page}`,
        instanceToInstance(users),
      );
    }

    return users;
  }
}

export default ListProviderService;
