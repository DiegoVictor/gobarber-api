import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

describe('ListProviderAppointmentsService', () => {
  let fakeAppointmentsRepository: FakeAppointmentsRepository;
  let fakeCacheProvider: FakeCacheProvider;
  let listProviderAppointments: ListProviderAppointmentsService;

  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the appointments on a specific day', async () => {
    const provider_id = '35345345';
    const user_id = '289734283';

    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2020, 6, 20, 14, 0, 0),
    });
    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2020, 6, 20, 15, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id,
      day: 20,
      year: 2020,
      month: 7,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
