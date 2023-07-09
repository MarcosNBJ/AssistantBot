import { Inject, Service } from 'typedi';
import { JobQueueService } from '../JobQueueService';

@Service()
export default class ScheduleReminderService {
  @Inject()
  private jobqueue!: JobQueueService;

  async execute(
    reminderData: { content: string,
      channelId: string,
      dateToRemind: string,
      timeToRemind: string,
    },
  ) {
    const [day, month, year] = reminderData.dateToRemind.split('/');
    const targetTime = new Date(`${month}/${day}/${year} ${reminderData.timeToRemind}`);
    const delay = Number(targetTime) - Number(new Date());
    const id = Math.random().toString(36).substring(7);
    await this.jobqueue.queue.add(`reminder-${id}`, {
      content: reminderData.content,
      channelId: reminderData.channelId,
    }, { delay });
  }
}
