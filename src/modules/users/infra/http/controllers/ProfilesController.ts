import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { instanceToInstance } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfilesController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute({ user_id });

    const userSerialized = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return response.json(instanceToInstance(userSerialized));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { name, email, old_password, password } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);
    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      old_password,
      password,
    });

    return response.json(instanceToInstance(user));
  }
}
