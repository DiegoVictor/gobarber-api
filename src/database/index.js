import Sequelize from 'sequelize';
import Mongoose from 'mongoose';
import postgres from '../config/postgres';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.postgres = new Sequelize(postgres);
    [User, File, Appointment]
      .map(model => model.init(this.postgres))
      .map(model => model.associate && model.associate(this.postgres.models));
  }

  mongo() {
    this.mongo = Mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
    });
  }
}

export default new Database();
