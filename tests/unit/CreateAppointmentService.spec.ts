import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

describe('CreateAppointmentService', () => {
  let fakeAppointmentsRepository: FakeAppointmentsRepository;
  let fakeNotificationsRepository: FakeNotificationsRepository;
  let fakeCacheProvider: FakeCacheProvider;
  let createAppointment: CreateAppointmentService;

  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const provider_id = '7497349';
    const user_id = '289734283';
    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id,
      user_id,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(provider_id);
  });

  it('should not be able to create a two appointment on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const date = new Date(2020, 4, 10, 15);
    const provider_id = '7497349';
    const user_id = '289734283';

    await createAppointment.execute({
      date,
      provider_id,
      user_id,
    });

    await expect(
      createAppointment.execute({
        date,
        provider_id,
        user_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const provider_id = '7497349';
    const user_id = '289734283';
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        provider_id,
        user_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const user_id = '289734283';
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 13),
        provider_id: user_id,
        user_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const user_id = '289734283';
    const provider_id = '7497349';
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 7),
        provider_id,
        user_id,
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 18),
        provider_id,
        user_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
