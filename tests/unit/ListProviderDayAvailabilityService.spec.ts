import faker from 'faker';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

describe('ListProviderDayAvailabilityService', () => {
  let fakeAppointmentsRepository: FakeAppointmentsRepository;
  let listProviderDayAvailability: ListProviderDayAvailabilityService;

  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the day availability from provider', async () => {
    const provider_id = String(faker.random.number());
    const user_id = String(faker.random.number());

    await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2020, 6, 20, 14, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2020, 6, 20, 15, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 6, 20, 11).getTime();
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id,
      year: 2020,
      month: 7,
      day: 20,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
      ]),
    );
  });
});
