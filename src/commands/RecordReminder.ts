import {
  ChatInputCommandInteraction, ApplicationCommandType, Message, ApplicationCommandOptionType,
} from 'discord.js';
import { Inject, Service } from 'typedi';
import { BaseCommand } from './BaseCommand';
import ScheduleReminderService from '../services/ScheduleReminderService';
import { askQuestion } from './utils/AskQuestion';

@Service()
export class RecordReminder extends BaseCommand {
  @Inject() protected scheduleReminderService!: ScheduleReminderService;

  constructor() {
    super(
      {
        name: 'reminder',

        description: 'Records a reminder',

        type: ApplicationCommandType.ChatInput,

        options: [
          {
            name: 'content',
            description: 'The content of the reminder',
            type: ApplicationCommandOptionType.String,
            required: true,

          },
          {
            name: 'date',
            description: 'The date to remind, in format DD/MM/YYYY',
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: 'time',
            description: 'The time of day to remind, in format HH:MM, 24h',
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
    );
  }

  async run(origin: ChatInputCommandInteraction | Message) {
    let reminderParams: {
      content: string,
      dateToRemind: string,
      channelId: string,
      timeToRemind: string,
    };
    if (origin instanceof ChatInputCommandInteraction) {
      const content = origin.options.getString('content', true);
      const dateToRemind = origin.options.getString('date', true);
      const timeToRemind = origin.options.getString('time', true);
      const { channelId } = origin;
      reminderParams = {
        content,
        dateToRemind,
        channelId,
        timeToRemind,
      };
      this.scheduleReminderService.execute(reminderParams);
      await origin.followUp(`
      Reminder recorded! I will remind you on ${reminderParams.dateToRemind} at ${reminderParams.timeToRemind}
    `);
      return;
    }

    reminderParams = {
      content: await askQuestion(origin, 'What is the content of the reminder?'),
      dateToRemind: await askQuestion(origin, 'What is the date to remind?, in format DD/MM/YYYY'),
      timeToRemind: await askQuestion(origin, 'What is the time to remind?, in format HH:MM, 24h'),
      channelId: origin.channel.id,
    };

    this.scheduleReminderService.execute(reminderParams);
    await origin.reply(`
      Reminder recorded! I will remind you on ${reminderParams.dateToRemind} at ${reminderParams.timeToRemind}
    `);
  }
}
