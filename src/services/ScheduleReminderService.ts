import { Queue } from 'bullmq';

class ScheduleReminderService {
  async execute(
    jobQueue: Queue<any, any, string>,
    content: string,
    channelId: string,
    dateToRemind: string,
  ) {
    const targetTime = new Date(dateToRemind);
    const delay = Number(targetTime) - Number(new Date());
    const id = Math.random().toString(36).substring(7);
    await jobQueue.add(`reminder-${id}`, {
      content,
      channelId,
    }, { delay });
  }
}

export default new ScheduleReminderService();
