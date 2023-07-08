import { Service } from 'typedi';
import Reminder from '../models/Reminder';

@Service()
export class RecordReminderService {
  async create(reminderData: {
    content: string, jobId: string, dateToRemind: string,
    type: string
  }) {
    const reminder = await Reminder.create(reminderData);

    return reminder;
  }

  async delete(jobId: string) {
    await Reminder.deleteOne({ jobId });
  }

  async getAll() {
    const reminders = await Reminder.find();

    return reminders;
  }
}
