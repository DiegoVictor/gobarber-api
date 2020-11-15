import { Router } from 'express';

import appointmentsRoutes from '@modules/appointments/infra/http/routes/appointments.routes';
import providersRoutes from '@modules/appointments/infra/http/routes/providers.routes';
import usersRoutes from '@modules/users/infra/http/routes/users.routes';
import sessionsRoutes from '@modules/users/infra/http/routes/sessions.routes';
import passwordRoutes from '@modules/users/infra/http/routes/password.routes';
import profileRoutes from '@modules/users/infra/http/routes/profile.routes';

const routes = Router();

routes.use('/sessions', sessionsRoutes);

routes.use('/providers', providersRoutes);
routes.use('/appointments', appointmentsRoutes);
routes.use('/users', usersRoutes);

routes.use('/password', passwordRoutes);
routes.use('/profile', profileRoutes);

export default routes;
