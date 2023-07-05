import {
  ApplicationCommandType,
  Message, ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  ApplicationCommandOptionData,
  ApplicationCommandSubCommandData,
  ApplicationCommandSubGroupData,
} from 'discord.js';
import { Inject, Service } from 'typedi';
import { BaseCommand } from './BaseCommand';
import ScheduleRecurringReminderService from '../services/ScheduleRecurringReminderService';
import weekDays from './utils/weekDays';

@Service()
export class RecordRecurringReminder extends BaseCommand {
  @Inject() protected scheduleRecurringReminderService!: ScheduleRecurringReminderService;

  constructor() {
    const options: Exclude<
    ApplicationCommandOptionData,
    ApplicationCommandSubGroupData
    | ApplicationCommandSubCommandData>[] = [
      {
        name: 'content',
        description: 'The content of the reminder',
        type: ApplicationCommandOptionType.String,
        required: true,
      },

      {
        name: 'time_of_day',
        description: 'The time of day to remind, in format HH:MM, 24h',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'day_of_month',
        description: 'Number of the day in which we should remind you (1-31)',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'day_of_week',
        description: 'The day of the week to remind',
        type: ApplicationCommandOptionType.Integer,
        choices: weekDays(),
        required: true,
      },
    ];

    super(
      {
        name: 'recurring_reminder',

        description: 'Records a recurring reminder',

        type: ApplicationCommandType.ChatInput,

        options: [
          {
            name: 'recurrence',
            type: ApplicationCommandOptionType.SubcommandGroup,
            description: 'The recurrence of the reminder',
            options: [
              {
                name: 'daily',
                description: 'The reminder will be repeated daily',
                type: ApplicationCommandOptionType.Subcommand,
                options: options.filter(
                  (option) => ['content', 'time_of_day'].includes(option.name),
                ),
              },
              {
                name: 'weekly',
                description: 'The reminder will be repeated weekly',
                type: ApplicationCommandOptionType.Subcommand,
                options: options.filter(
                  (option) => ['content', 'time_of_day', 'day_of_week'].includes(option.name),
                ),
              },
              {
                name: 'monthly',
                description: 'The reminder will be repeated monthly',
                type: ApplicationCommandOptionType.Subcommand,
                options: options.filter(
                  (option) => ['content', 'time_of_day', 'day_of_month'].includes(option.name),
                ),
              },
            ],
          },
        ],
      },
    );
  }

  async run(origin: ChatInputCommandInteraction | Message) {
    if (origin instanceof ChatInputCommandInteraction) {
      const timeOfDay = origin.options.getString('time_of_day', true);
      const [hour, minute] = timeOfDay.split(':');
      const content = origin.options.getString('content', true);
      const { channelId } = origin;
      let cronExp = '';
      let replyMessageDetail = '';

      switch (origin.options.getSubcommand()) {
        case 'daily': {
          cronExp = `0 ${+minute || 0} ${+hour} * * *`;
          replyMessageDetail = `every day at ${timeOfDay}`;
          break;
        }
        case 'weekly': {
          const dayOfWeek = origin.options.getInteger('day_of_week', true);
          cronExp = `0 ${+minute || 0} ${+hour} * * ${dayOfWeek}`;
          replyMessageDetail = `every ${weekDays().find((day) => day.value === dayOfWeek)?.name} at ${timeOfDay}`;
          break;
        }
        case 'monthly': {
          const dayOfMonth = origin.options.getString('day_of_month', true);
          cronExp = `0 ${+minute || 0} ${+hour} ${dayOfMonth} * *`;
          replyMessageDetail = `every day ${dayOfMonth} of each month, at ${timeOfDay}`;
          break;
        }
        default:
          break;
      }
      origin.reply(`Recorded! I will remind you ${replyMessageDetail}`);
      await this.scheduleRecurringReminderService.execute({ channelId, content, cronExp });
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

    const recurrence = await askQuestion(origin, 'What is the recurrence of the reminder? (daily, weekly, monthly)');
    const content = await askQuestion(origin, 'What is the content of the reminder?');
    const timeOfDay = await askQuestion(origin, 'What time of day? (HH:MM, 24h)') || '00:00';
    const [hour, minute] = timeOfDay.split(':');

    if (!content) {
      origin.channel.send('Invalid content');
      return;
    }
    switch (recurrence) {
      case 'daily': {
        const cronExp = `0 ${+minute || 0} ${+hour} * * *`;
        await this.scheduleRecurringReminderService.execute(
          {
            channelId: origin.channelId,
            content,
            pattern: cronExp,
          },
        );
        origin.reply(`Recorded! I will remind you daily at ${timeOfDay}`);
        break;
      }
      case 'weekly': {
        const dayOfWeek = await askQuestion(origin, 'In what day of the week would you like to be reminded? (Sunday, Monday, etc.)');
        const weekDayNumber = weekDays().find(
          (day) => day.name === dayOfWeek?.toLocaleLowerCase(),
        )?.value;
        const cronExp = `0 ${+minute || 0} ${+hour} * * ${weekDayNumber}`;
        await this.scheduleRecurringReminderService.execute(
          {
            channelId: origin.channelId,
            content,
            pattern: cronExp,
          },
        );
        origin.reply(`Recorded! I will remind you every ${dayOfWeek} at ${timeOfDay}`);
        break;
      }
      case 'monthly': {
        const dayOfMonth = await askQuestion(origin, 'In what day of the month would you like to be reminded? (1-31)');
        const cronExp = `0 ${+minute || 0} ${+hour} ${dayOfMonth} * *`;
        await this.scheduleRecurringReminderService.execute(
          {
            channelId: origin.channelId,
            content,
            pattern: cronExp,
          },
        );
        origin.reply(`Recorded! I will remind you every ${dayOfMonth} at ${timeOfDay}`);
        break;
      }
      default:
        break;
    }
  }
}
