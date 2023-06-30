import { CommandInteraction, ApplicationCommandType, Message } from 'discord.js';
import { ICommand } from './types/ICommand';

export const Hello: ICommand = {
  name: 'hello',
  description: 'Returns a greeting',
  type: ApplicationCommandType.ChatInput,
  run: async (origin: CommandInteraction | Message) => {
    const content = 'Hello there!';
    if (origin instanceof CommandInteraction) {
      await origin.followUp({
        ephemeral: true,
        content,
      });
    } else if (origin instanceof Message) {
      await origin.reply(content);
    }
  },
};
