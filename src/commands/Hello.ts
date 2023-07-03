import { CommandInteraction, ApplicationCommandType, Message } from 'discord.js';
import { Queue } from 'bullmq';
import { ICommand } from './types/ICommand';

export const Hello: ICommand = {
  name: 'hello',
  description: 'Returns a greeting',
  type: ApplicationCommandType.ChatInput,
  run: async (jobQueue: Queue<any, any, string>, origin: CommandInteraction | Message) => {
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
