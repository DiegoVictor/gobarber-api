import { model as Model, Schema } from 'mongoose';

export default Model(
  'Notification',
  new Schema(
    {
      content: {
        type: String,
        required: true,
      },
      user: {
        type: Number,
        required: true,
      },
      read: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  )
);
