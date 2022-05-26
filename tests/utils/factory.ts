import { faker } from '@faker-js/faker';
import factory from 'factory-girl';

factory.define(
  'User',
  {},
  {
    email: faker.internet.email,
    password: faker.internet.password,
    name: faker.name.findName,
  },
);

export default factory;
