import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';
import Cache from '../../lib/Cache';

class CreateAppointmentService {
  async run({ provider_id, user_id, date }) {
    /**
     * Prevent provider to create an appointment with itself
     */
    if (provider_id === user_id) {
      throw new Error("You can't create appointments with yourself");
    }

    /**
     * Check if provider_id is a provider
     */
    const is_provider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!is_provider) {
      throw new Error('You can only create appointments with providers');
    }

    /**
     * Check for past dates
     */
    const hour_start = startOfHour(parseISO(date));
    if (isBefore(hour_start, new Date())) {
      throw new Error('Past dates are not permited');
    }

    /**
     * Check date availability
     */
    const check_availability = await Appointment.findOne({
      where: { provider_id, canceled_at: null, date: hour_start },
    });
    if (check_availability) {
      throw new Error('Appointment date is not available');
    }

    const appointment = await Appointment.create({
      user_id,
      provider_id,
      date,
    });

    /**
     * Notify appointment provider
     */
    const user = await User.findByPk(user_id);
    const formated_date = format(parseISO(date), "dd 'de' MMMM', às' H:mm'h'", {
      locale: pt,
    });

    await Notification.create({
      content: `Novo agendamento de ${user.name} para o dia ${formated_date}`,
      user: provider_id,
    });

    /**
     * Invalidate cache
     */
    await Cache.invalidatePrefix(`user:${user_id}:appointments`);

    return appointment;
  }
}

export default new CreateAppointmentService();
