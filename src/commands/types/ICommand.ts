import { CommandInteraction, ChatInputApplicationCommandData, Message } from 'discord.js';

export interface ICommand extends ChatInputApplicationCommandData {
  run: (origin: CommandInteraction | Message) => void;
}
