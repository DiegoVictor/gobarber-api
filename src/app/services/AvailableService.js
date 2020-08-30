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

class AvailableService {
  async run({ date, provider_id }) {
    const appointments = await Appointment.findAll({
      where: {
        provider_id,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
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
      const value = setSeconds(setMinutes(setHours(date, hour), minute), 0);

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

    return available;
  }
}

export default new AvailableService();
