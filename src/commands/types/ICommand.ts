import { Queue } from 'bullmq';
import { CommandInteraction, ChatInputApplicationCommandData, Message } from 'discord.js';

export interface ICommand extends ChatInputApplicationCommandData {
  run: (jobQueue: Queue<any, any, string>, origin: CommandInteraction | Message) => void;
}
