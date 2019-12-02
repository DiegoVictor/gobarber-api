import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    const check_provider = await User.findOne({
      where: { id: req.user_id, provider: true },
    });

    if (!check_provider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    const date = parseISO(req.query.date);
    const appoitments = await Appointment.findAll({
      where: {
        provider_id: req.user_id,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
      order: ['date'],
    });
    return res.json(appoitments);
  }
}

export default new ScheduleController();
