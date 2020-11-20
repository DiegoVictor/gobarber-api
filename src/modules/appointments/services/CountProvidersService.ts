import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

@injectable()
class CountProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(user_id: string): Promise<number> {
    let count = await this.cacheProvider.recover<number>(
      `providers_count:${user_id}`,
    );

    if (!count) {
      count = await this.usersRepository.countProviders(user_id);

      await this.cacheProvider.save(`providers_list:${user_id}`, count);
    }

    return count;
  }
}

export default CountProvidersService;
