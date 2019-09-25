import jwt from 'jsonwebtoken';
import User from '../models/User';
import File from '../models/File';

import { SECRET, EXPIRATION_TIME } from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({
        error: 'User not found',
      });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({
        error: 'Password does not match',
      });
    }

    const { id, name, avatar, provider } = user;
    return res.json({
      user: { id, name, email, avatar, provider },
      token: jwt.sign({ id }, SECRET, {
        expiresIn: EXPIRATION_TIME,
      }),
    });
  }
}
export default new SessionController();
