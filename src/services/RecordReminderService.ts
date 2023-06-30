import Reminder from '../models/Reminder';

class RecordReminderService {
  async execute(content: string, channelId: string, dateToRemind: string) {
    const reminder = await Reminder.create({
      content,
      channelId,
      dateToRemind,
    });

    return reminder;
  }
}

export default new RecordReminderService();
