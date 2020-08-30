import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const is_provider = await User.findOne({
      where: { id: req.user_id, provider: true },
    });

    if (!is_provider) {
      return res.status(401).json({
        error: 'Only providers can load notifications',
      });
    }

    const notifications = await Notification.find({ user: req.user_id })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    return res.json(
      await Notification.findByIdAndUpdate(
        req.params.id,
        { read: true },
        { new: true }
      )
    );
  }
}

export default new NotificationController();
