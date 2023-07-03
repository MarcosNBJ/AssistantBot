import {
  ApplicationCommandType,
  ApplicationCommandOptionData,
  CommandInteraction,
  Message,
} from 'discord.js';
import { Inject, Service } from 'typedi';
import { ICommand } from './types/ICommand';
import ScheduleReminderService from '../services/ScheduleReminderService';

interface CommandData {
  name: string;
  type: ApplicationCommandType.ChatInput;
  description: string;
  options: ApplicationCommandOptionData[];
}

@Service()
export abstract class BaseCommand implements ICommand {
  @Inject() protected scheduleReminderService!: ScheduleReminderService;

  public name: string;

  public type: ApplicationCommandType.ChatInput;

  public description: string;

  public options: ApplicationCommandOptionData[];

  constructor({
    name,
    type,
    description,
    options,
  }: CommandData) {
    this.name = name;
    this.type = type;
    this.description = description;
    this.options = options;
  }

  abstract run(origin: CommandInteraction | Message): Promise<void>;
}
