import { Router } from 'express';
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';
import Multer from 'multer';
import Auth from './app/middlewares/auth';

import storage from './config/storage';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import NotificationController from './app/controllers/NotificationController';
import ScheduleController from './app/controllers/ScheduleController';
import AvailableController from './app/controllers/AvailableController';

import UserStoreValidation from './app/validators/UserStore';
import UserUpdateValidation from './app/validators/UserUpdate';
import SessionStoreValidation from './app/validators/SessionStore';
import AppointmentStoreValidation from './app/validators/AppointmentStore';

const Route = new Router();
const brute_force = new Brute(
  new BruteRedis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  })
);

Route.post(
  '/sessions',
  brute_force.prevent,
  SessionStoreValidation,
  SessionController.store
);
Route.post('/users', UserStoreValidation, UserController.store);

Route.use(Auth);

Route.get('/providers', ProviderController.index);
Route.get('/providers/:id/available', AvailableController.index);

Route.put('/users', UserUpdateValidation, UserController.update);

Route.get('/appointments', AppointmentController.index);
Route.post(
  '/appointments',
  AppointmentStoreValidation,
  AppointmentController.store
);
Route.delete('/appointments/:id', AppointmentController.delete);

Route.post('/files', Multer(storage).single('file'), FileController.store);

Route.get('/notifications', NotificationController.index);
Route.put('/notifications/:id', NotificationController.update);

Route.get('/schedule', ScheduleController.index);

export default Route;
