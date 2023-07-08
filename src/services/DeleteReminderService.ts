import { Inject, Service } from 'typedi';
import { JobQueueService } from '../JobQueueService';

@Service()
export default class DeleteReminderService {
  @Inject()
  private jobqueue!: JobQueueService;

  async execute(
    reminderData: {
      type: string,
      id: string,
    },
  ) {
    if (reminderData.type === 'recurring') {
      await this.jobqueue.queue.removeRepeatableByKey(reminderData.id);
      return;
    }
    await this.jobqueue.queue.remove(reminderData.id);
  }
}
