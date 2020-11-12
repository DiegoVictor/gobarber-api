import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

describe('ListProviderMonthAvailabilityService', () => {
  let fakeAppointmentsRepository: FakeAppointmentsRepository;
  let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository
    );
  });

  it('should be able to list the month availability from provider', async () => {
    const provider_id = '35345345';
    const user_id = '289734283';

    const appointments = [];
    for (let i = 8; i < 18; i++) {
      appointments.push(
        fakeAppointmentsRepository.create({
          provider_id,
          user_id,
          date: new Date(2020, 6, 20, i, 0, 0),
        })
      );
    }
    Promise.all(appointments);

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 6, 1, 8).getTime();
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id,
      year: 2020,
      month: 7,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
      ])
    );
  });
});
