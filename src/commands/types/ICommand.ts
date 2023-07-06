import { ChatInputCommandInteraction, ChatInputApplicationCommandData, Message } from 'discord.js';

export interface ICommand extends ChatInputApplicationCommandData {
  run: (origin: ChatInputCommandInteraction | Message) => Promise<void>;
}
