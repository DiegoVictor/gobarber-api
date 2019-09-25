import AvailableService from '../services/AvailableService';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const search_date = Number(date);
    const available = await AvailableService.run({
      date: search_date,
      provider_id: req.params.id,
    });

    return res.json(available);
  }
}

export default new AvailableController();
