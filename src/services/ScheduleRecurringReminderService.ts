import { Inject, Service } from 'typedi';
import { JobQueueService } from '../JobQueueService';

@Service()
export default class ScheduleRecurringReminderService {
  @Inject()
  private jobqueue!: JobQueueService;

  async execute(
    reminderData: {
      content: string,
      channelId: string,
      cronExp: string,
    },
  ) {
    const id = `reminder-${Math.random().toString(36).substring(7)}`;
    await this.jobqueue.add(id, {
      content: reminderData.content,
      channelId: reminderData.channelId,
    }, {
      repeat: {
        pattern: reminderData.cronExp,
      },
    });
  }
}
