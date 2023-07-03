import {
  CommandInteraction, ApplicationCommandType, Message, ApplicationCommandOptionType,
} from 'discord.js';
import { Service } from 'typedi';
import { BaseCommand } from './BaseCommand';

@Service()
export class RecordReminder extends BaseCommand {
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
            description: 'The date to remind',
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

    this.scheduleReminderService.execute(
      reminderParams.content,
      reminderParams.channelId,
      reminderParams.dateToRemind,
    );
    await origin.reply(JSON.stringify(reminderParams));
  }
}
