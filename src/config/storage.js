import Multer from 'multer';
import Crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: Multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, callback) => {
      Crypto.randomBytes(16, (err, res) => {
        if (err) {
          return callback(err);
        }

        return callback(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
