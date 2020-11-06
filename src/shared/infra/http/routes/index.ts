import { Router } from 'express';

import providersRoutes from '@modules/appointments/infra/http/routes/providers.routes';
import sessionsRoutes from '@modules/users/infra/http/routes/sessions.routes';
import passwordRoutes from '@modules/users/infra/http/routes/password.routes';

const routes = Router();

routes.use('/sessions', sessionsRoutes);

routes.use('/providers', providersRoutes);
routes.use('/password', passwordRoutes);
export default routes;
