import {
  ApplicationCommandType,
  Message, ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  ApplicationCommandOptionData,
  ApplicationCommandSubCommandData,
  ApplicationCommandSubGroupData,
} from 'discord.js';
import { Inject, Service } from 'typedi';
import { BaseCommand } from '../BaseCommand';
import ScheduleRecurringReminderService from '../../services/ScheduleRecurringReminderService';
import weekDays from '../utils/WeekDays';
import slashExecute from './slashCommand';
import chatCommand from './chatCommand';

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
      slashExecute(origin, this.scheduleRecurringReminderService);
      return;
    }

    chatCommand(origin, this.scheduleRecurringReminderService);
  }
}
