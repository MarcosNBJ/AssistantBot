import {
  CommandInteraction, ApplicationCommandType, Message, ApplicationCommandOptionType,
} from 'discord.js';
import { Queue } from 'bullmq';
import { ICommand } from './types/ICommand';
import ScheduleReminderService from '../services/ScheduleReminderService';

export const RecordReminder: ICommand = {
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
      description: 'The date to remind',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (jobQueue: Queue<any, any, string>, origin: CommandInteraction | Message) => {
    let reminderParams: {
      content: string,
      dateToRemind: string,
      channelId: string,
    } = {
      content: '',
      dateToRemind: '',
      channelId: '',
    };
    if (origin instanceof CommandInteraction) {
      const content = origin.options.get('content')?.value as string;
      const dateToRemind = origin.options.get('date')?.value as string;
      const { channelId } = origin;
      reminderParams = {
        content,
        dateToRemind,
        channelId,
      };
      await origin.followUp(JSON.stringify(reminderParams));
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

    const dateToRemind = await askQuestion(origin, 'What is the date to remind?');
    if (!dateToRemind) return;
    reminderParams.dateToRemind = dateToRemind;

    reminderParams.channelId = origin.channel.id;

    ScheduleReminderService.execute(
      jobQueue,
      reminderParams.content,
      reminderParams.channelId,
      reminderParams.dateToRemind,
    );
    await origin.reply(JSON.stringify(reminderParams));
  },
};
