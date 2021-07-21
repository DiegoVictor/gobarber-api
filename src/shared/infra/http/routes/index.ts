import { Router } from 'express';

import appointmentsRoutes from '@modules/appointments/infra/http/routes/appointments.routes';
import providersRoutes from '@modules/appointments/infra/http/routes/providers.routes';
import usersRoutes from '@modules/users/infra/http/routes/users.routes';
import sessionsRoutes from '@modules/users/infra/http/routes/sessions.routes';
import passwordRoutes from '@modules/users/infra/http/routes/password.routes';
import profileRoutes from '@modules/users/infra/http/routes/profile.routes';

const app = Router();

app.use('/sessions', sessionsRoutes);

app.use('/providers', providersRoutes);
app.use('/appointments', appointmentsRoutes);
app.use('/users', usersRoutes);

app.use('/password', passwordRoutes);
app.use('/profile', profileRoutes);

export default app;
