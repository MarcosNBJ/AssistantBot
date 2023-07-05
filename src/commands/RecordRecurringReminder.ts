import {
  CommandInteraction, ApplicationCommandType,
  Message, ApplicationCommandOptionType,
  ChatInputCommandInteraction,
} from 'discord.js';
import { Inject, Service } from 'typedi';
import { BaseCommand } from './BaseCommand';
import ScheduleRecurringReminderService from '../services/ScheduleRecurringReminderService';

@Service()
export class RecordRecurringReminder extends BaseCommand {
  @Inject() protected scheduleRecurringReminderService!: ScheduleRecurringReminderService;

  constructor() {
    super(
      {
        name: 'recurringreminder',

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
                options: [
                  {
                    name: 'time_of_day',
                    description: 'The time of day to remind, in format HH:MM, 24h',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                  },
                  {
                    name: 'content',
                    description: 'The content of the reminder',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                  },
                ],
              },
              {
                name: 'weekly',
                description: 'The reminder will be repeated weekly',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                  {
                    name: 'day_of_week',
                    description: 'The day of the week to remind',
                    type: ApplicationCommandOptionType.String,
                    choices: [
                      ...Array.from(Array(7).keys()).map((i) => {
                        const day = new Date(0, 0, i).toLocaleString('en-US', { weekday: 'long' });
                        return {
                          name: day,
                          value: day,
                        };
                      }),
                    ],
                    required: true,
                  },
                  {
                    name: 'time_of_day',
                    description: 'The time of day to remind, in format HH:MM, 24h',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                  },
                  {
                    name: 'content',
                    description: 'The content of the reminder',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                  },
                ],
              },
              {
                name: 'monthly',
                description: 'The reminder will be repeated monthly',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                  {
                    name: 'day_of_month',
                    description: 'Number of the day of the month to remind (1-31)',
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
                    name: 'content',
                    description: 'The content of the reminder',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                  },
                ],
              },
            ],
          },
        ],
      },
    );
  }

  async run(origin: CommandInteraction | Message) {
    if (origin instanceof ChatInputCommandInteraction) {
      switch (origin.options.getSubcommand()) {
        case 'daily': {
          const timeOfDay = origin.options.getString('time_of_day', true);
          const [hour, minute] = timeOfDay.split(':');
          const cronExp = `0 ${+minute || 0} ${+hour} * * *`;
          const content = origin.options.getString('content', true);
          await this.scheduleRecurringReminderService.execute(
            {
              channelId: origin.channelId,
              content,
              pattern: cronExp,
            },
          );
          origin.followUp(`Recorded! I will remind you daily at ${timeOfDay}`);
          break;
        }
        case 'weekly': {
          const dayOfWeek = origin.options.getString('day_of_week', true);
          const timeOfDay = origin.options.getString('time_of_day', true);
          const [hour, minute] = timeOfDay.split(':');
          const cronExp = `0 ${+minute || 0} ${+hour} * * ${dayOfWeek}`;
          const content = origin.options.getString('content', true);
          await this.scheduleRecurringReminderService.execute(
            {
              channelId: origin.channelId,
              content,
              pattern: cronExp,
            },
          );
          origin.followUp(`Recorded! I will remind you every ${dayOfWeek} at ${timeOfDay}`);
          break;
        }
        case 'monthly': {
          const dayOfMonth = origin.options.getString('day_of_month', true);
          const timeOfDay = origin.options.getString('time_of_day', true);
          const [hour, minute] = timeOfDay.split(':');
          const cronExp = `0 ${+minute || 0} ${+hour} ${dayOfMonth} * *`;
          const content = origin.options.getString('content', true);
          await this.scheduleRecurringReminderService.execute(
            {
              channelId: origin.channelId,
              content,
              pattern: cronExp,
            },
          );
          origin.followUp(`Recorded! I will remind you every ${dayOfMonth} at ${timeOfDay}`);
          break;
        }
        default:
          break;
      }
    }
  }
}
