import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import CreateAppointmentService from '../services/CreateAppointmentService';
import CancelAppointmentService from '../services/CancelAppointmentService';
import Cache from '../../lib/Cache';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const key = `user:${req.user_id}:appointments:${page}`;
    const cached = await Cache.get(key);

    if (cached) {
      return res.json(cached);
    }

    const appointments = await Appointment.findAll({
      where: { user_id: req.user_id, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date', 'past', 'cancelable'],
      limit: 20,
      offset: 20 * (page - 1),
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    await Cache.set(key, appointments);
    return res.json(appointments);
  }

  async store(req, res) {
    const { provider_id, date } = req.body;
    const appointment = await CreateAppointmentService.run({
      provider_id,
      user_id: req.user_id,
      date,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await CancelAppointmentService.run({
      user_id: req.user_id,
      provider_id: req.params.id,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
