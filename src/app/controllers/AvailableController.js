import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const search_date = Number(date);
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.id,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(search_date), endOfDay(search_date)],
        },
      },
    });

    const schedule = (() => {
      const hours = [];
      for (let i = 8; i < 19; i += 1) {
        hours.push(`${`0${i}`.slice(-2)}:00`);
      }
      return hours;
    })();

    const available = schedule.map(time => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(search_date, hour), minute),
        0
      );

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          !appointments.find(
            appointment => format(appointment.date, 'HH:mm') === time
          ),
      };
    });

    return res.json(available);
  }
}

export default new AvailableController();
