import User from '../models/User';
import File from '../models/File';
import Cache from '../../lib/Cache';

class UserController {
  async store(req, res) {
    const user_exists = await User.findOne({
      where: { email: req.body.email },
    });

    if (user_exists) {
      return res.status(400).json({
        error: 'User already exists',
      });
    }

    const { id, name, email, provider } = await User.create(req.body);

    if (provider) {
      await Cache.invalidate('providers');
    }

    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    const { email, old_password } = req.body;
    const user = await User.findByPk(req.user_id);

    if (email !== user.email) {
      const user_exists = await User.findOne({ where: { email } });
      if (user_exists) {
        return res.status(400).json({
          error: 'User already exists',
        });
      }
    }

    if (old_password && !(await user.checkPassword(old_password))) {
      return res.status(401).json({
        error: 'Password does not match',
      });
    }

    await user.update(req.body);

    const { id, name, avatar } = await User.findByPk(req.user_id, {
      include: {
        model: File,
        as: 'avatar',
        attributes: ['id', 'url', 'path'],
      },
    });
    return res.json({ id, name, email, avatar });
  }
}

export default new UserController();
