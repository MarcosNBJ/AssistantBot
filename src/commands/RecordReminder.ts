import {
  CommandInteraction, ApplicationCommandType, Message, ApplicationCommandOptionType,
} from 'discord.js';
import { Inject, Service } from 'typedi';
import { BaseCommand } from './BaseCommand';
import ScheduleReminderService from '../services/ScheduleReminderService';

@Service()
export class RecordReminder extends BaseCommand {
  @Inject() protected scheduleReminderService!: ScheduleReminderService;

  constructor() {
    super(
      {
        name: 'recordreminder',

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

  async run(origin: CommandInteraction | Message) {
    let reminderParams: {
      content: string,
      dateToRemind: string,
      channelId: string,
      timeToRemind: string,
    } = {
      content: '',
      dateToRemind: '',
      channelId: '',
      timeToRemind: '',
    };
    if (origin instanceof CommandInteraction) {
      const content = origin.options.get('content')?.value as string;
      const dateToRemind = origin.options.get('date')?.value as string;
      const timeToRemind = origin.options.get('time')?.value as string;
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

    const askQuestion = async (message: Message, question: string) => {
      await message.channel.send(question);
      const filter = (response: Message) => response.author.id === message.author.id;
      const collected = await message.channel.awaitMessages({
        filter, max: 1, time: 15000, errors: ['time'],
      });
      return collected.first()?.content;
    };

    const content = await askQuestion(origin, 'What is the content of the reminder?');
    if (!content) return;
    reminderParams.content = content;

    const dateToRemind = await askQuestion(origin, 'What is the date to remind?, in format DD/MM/YYYY');
    if (!dateToRemind) return;
    reminderParams.dateToRemind = dateToRemind;

    const timeToRemind = await askQuestion(origin, 'What is the time to remind?, in format HH:MM, 24h');
    if (!timeToRemind) return;
    reminderParams.timeToRemind = timeToRemind;

    reminderParams.channelId = origin.channel.id;

    this.scheduleReminderService.execute(reminderParams);
    await origin.reply(`
      Reminder recorded! I will remind you on ${reminderParams.dateToRemind} at ${reminderParams.timeToRemind}
    `);
  }
}
