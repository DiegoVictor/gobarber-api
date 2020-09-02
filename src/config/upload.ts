import crypto from 'crypto';
import path from 'path';
import multer, { StorageEngine } from 'multer';

const tmpDirectory = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 's3' | 'disk';

  tmpDirectory: string;
  uploadsDirectory: string;

  multer: {
    storage: StorageEngine;
  };

  config: {
    disk: {};
    aws: {
      bucket: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpDirectory,
  uploadsDirectory: path.resolve(tmpDirectory, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpDirectory,
      filename(_, file, callback) {
        const file_hash = crypto.randomBytes(10).toString('hex');
        const file_name = `${file_hash}-${file.originalname}`;

        return callback(null, file_name);
      },
    }),
  },

  config: {
    disk: {},
    aws: {
      bucket: process.env.AWS_S3_BUCKET_NAME,
    },
  },
} as IUploadConfig;
