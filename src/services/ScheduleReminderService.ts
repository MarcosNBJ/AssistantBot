import { Inject, Service } from 'typedi';
import { JobQueueService } from '../JobQueueService';

@Service()
export default class ScheduleReminderService {
  @Inject()
  private jobqueue!: JobQueueService;

  async execute(
    content: string,
    channelId: string,
    dateToRemind: string,
  ) {
    const targetTime = new Date(dateToRemind);
    const delay = Number(targetTime) - Number(new Date());
    const id = Math.random().toString(36).substring(7);
    await this.jobqueue.queue.add(`reminder-${id}`, {
      content,
      channelId,
    }, { delay });
  }
}
