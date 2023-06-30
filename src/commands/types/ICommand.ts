import { CommandInteraction, ChatInputApplicationCommandData } from 'discord.js';

export interface ICommand extends ChatInputApplicationCommandData {
  run: (interaction: CommandInteraction) => void;
}
