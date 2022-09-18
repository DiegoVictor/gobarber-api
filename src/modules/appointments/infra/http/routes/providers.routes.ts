import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';

const routes = Router();
const providersController = new ProvidersController();
const providerMonthAvailabilityController =
  new ProviderMonthAvailabilityController();
const providerDayAvailabilityController =
  new ProviderDayAvailabilityController();

routes.use(ensureAuthenticated);

routes.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number().optional(),
    },
  }),
  providersController.index,
);
routes.get(
  '/:id/month_availability',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.QUERY]: {
      month: Joi.number().required(),
      year: Joi.number().required(),
    },
  }),
  providerMonthAvailabilityController.index,
);
routes.get(
  '/:id/day_availability',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  providerDayAvailabilityController.index,
);

export default routes;
