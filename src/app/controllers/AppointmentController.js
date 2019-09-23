import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
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
    return res.json(appointments);
  }

  async store(req, res) {
    const { provider_id, date } = req.body;

    /**
     * Prevent provider to create an appointment with itself
     */
    if (provider_id === req.user_id) {
      return res.status(401).json({
        error: "You can't create appointments with yourself",
      });
    }

    /**
     * Check if provider_id is a provider
     */
    const is_provider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!is_provider) {
      return res.status(401).json({
        error: 'You can only create appointments with providers',
      });
    }

    /**
     * Check for past dates
     */
    const hour_start = startOfHour(parseISO(date));
    if (isBefore(hour_start, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }

    /**
     * Check date availability
     */
    const check_availability = await Appointment.findOne({
      where: { provider_id, canceled_at: null, date: hour_start },
    });
    if (check_availability) {
      return res.status(400).json({
        error: 'Appointment date is not available',
      });
    }

    const appointment = await Appointment.create({
      user_id: req.user_id,
      provider_id,
      date,
    });

    /**
     * Notify appointment provider
     */
    const user = await User.findByPk(req.user_id);
    const formated_date = format(parseISO(date), "dd 'de' MMMM', às' H:mm'h'", {
      locale: pt,
    });

    await Notification.create({
      content: `Novo agendamento de ${user.name} para o dia ${formated_date}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (appointment.user_id !== req.user_id) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment",
      });
    }

    const limit_to_cancel = subHours(appointment.date, 2);
    if (isBefore(limit_to_cancel, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments 2 hours in advance',
      });
    }

    appointment.canceled_at = new Date();
    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
