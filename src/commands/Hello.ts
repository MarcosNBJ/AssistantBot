import { CommandInteraction, ApplicationCommandType } from 'discord.js';
import { ICommand } from './types/ICommand';

export const Hello: ICommand = {
  name: 'hello',
  description: 'Returns a greeting',
  type: ApplicationCommandType.ChatInput,
  run: async (interaction: CommandInteraction) => {
    const content = 'Hello there!';

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
