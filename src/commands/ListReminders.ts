import {
  ChatInputCommandInteraction, ApplicationCommandType, Message,
} from 'discord.js';
import { Inject, Service } from 'typedi';
import { BaseCommand } from './BaseCommand';
import ScheduleReminderService from '../services/ScheduleReminderService';
import { JobQueueService } from '../JobQueueService';

const DELETE_BUTTON = {
  type: 2,
  style: 4,
  label: 'Delete',
  disabled: false,
};

@Service()
export class ListReminders extends BaseCommand {
  @Inject() protected scheduleReminderService!: ScheduleReminderService;

  @Inject()
  private jobqueue!: JobQueueService;

  constructor() {
    super(
      {
        name: 'list_reminders',

        description: 'List all reminders',

        type: ApplicationCommandType.ChatInput,
      },
    );
  }

  private async handleJob(origin: ChatInputCommandInteraction, job: any): Promise<boolean> {
    const { id } = job;
    const jobData = await this.jobqueue.queue.getJob(id);
    if (!jobData?.id) return false;
    const repeatJobKey = jobData?.repeatJobKey;
    const content = jobData?.data?.content;
    const jobType = repeatJobKey ? 'recurring' : 'one-time';

    const deleteButton = {
      ...DELETE_BUTTON,
      custom_id: `delete_reminder#${jobType}#${repeatJobKey || id}`,
    };
    const components = [{
      type: 1,
      components: [deleteButton],
    }];
    await origin.followUp({ content, components }).then(
      (msg) => setTimeout(() => msg.delete(), 10000),
    );
    return true;
  }

  public async run(origin: ChatInputCommandInteraction | Message): Promise<void> {
    if (origin instanceof ChatInputCommandInteraction) {
      let oneTimeJobs = await this.jobqueue.queue.getJobs();

      oneTimeJobs = oneTimeJobs.filter((job) => !job?.repeatJobKey);

      const recurringJobs = await this.jobqueue.queue.getRepeatableJobs();
      const jobs = [...oneTimeJobs, ...recurringJobs];
      const uniqueJobs = jobs.filter(
        (job, index, self) => self.findIndex((j) => j.id === job.id) === index,
      );
      const messages = await Promise.all(uniqueJobs.map((job) => this.handleJob(origin, job)));

      if (!messages.find((m) => m)) await origin.followUp('No reminders found');
    }
  }
}
