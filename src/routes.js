import { Router } from 'express';
import Multer from 'multer';
import Auth from './app/middlewares/auth';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import NotificationController from './app/controllers/NotificationController';
import ScheduleController from './app/controllers/ScheduleController';
import AvailableController from './app/controllers/AvailableController';
import storage from './config/storage';

const Route = new Router();

Route.post('/sessions', SessionController.store);
Route.post('/users', UserController.store);

Route.use(Auth);

Route.get('/providers', ProviderController.index);
Route.get('/providers/:id/available', AvailableController.index);

Route.put('/users', UserController.update);

Route.get('/appointments', AppointmentController.index);
Route.post('/appointments', AppointmentController.store);
Route.delete('/appointments/:id', AppointmentController.delete);

Route.post('/files', Multer(storage).single('file'), FileController.store);

Route.get('/notifications', NotificationController.index);
Route.put('/notifications/:id', NotificationController.update);

Route.get('/schedule', ScheduleController.index);

export default Route;
