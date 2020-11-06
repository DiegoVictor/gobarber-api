import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import ProfilesController from '../controllers/ProfilesController';

const routes = Router();
const profilesController = new ProfilesController();

routes.use(ensureAuthenticated);
routes.get('/', profilesController.show);
routes.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  profilesController.update,
);

export default routes;
