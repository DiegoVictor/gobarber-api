import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import ListProviderService from '@modules/appointments/services/ListProviderService';
import CountProvidersService from '@modules/appointments/services/CountProvidersService';
import PaginationLinks from '@shared/helpers/PaginationLinks';

interface CustomRequest {
  query: {
    page: number;
  };
}

export default class ProvidersController {
  public async index(
    request: Request & CustomRequest,
    response: Response,
  ): Promise<Response> {
    const { currentUrl } = request;
    let { page = 1 } = request.query;
    const user_id = request.user.id;
    const take = 30;

    const listProvider = container.resolve(ListProviderService);
    const providers = await listProvider.execute({
      user_id,
      page,
      take,
    });

    const countProviders = container.resolve(CountProvidersService);
    const count = await countProviders.execute(user_id);

    response.header('X-Total-Count', String(count));

    const pagesTotal = Math.ceil(count / take);
    if (pagesTotal > 1) {
      response.links(PaginationLinks(page, pagesTotal, currentUrl));
    }

    return response.json(instanceToInstance(providers));
  }
}
