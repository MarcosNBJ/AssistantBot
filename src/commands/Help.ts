import {
  ChatInputCommandInteraction, ApplicationCommandType, Message,
} from 'discord.js';
import { Service } from 'typedi';
import { BaseCommand } from './BaseCommand';
import { Commands } from './index';

@Service()
export class Help extends BaseCommand {
  constructor() {
    super(
      {
        name: 'help',

        description: 'Displays descriptions for all available commands',

        type: ApplicationCommandType.ChatInput,
      },
    );
  }

  public async run(origin: ChatInputCommandInteraction | Message): Promise<void> {
    const descriptions = Commands.map(
      (c) => `**${c.name}**\n\`\`\`${c.description} \`\`\``,
    ).join('\n');
    if (origin instanceof ChatInputCommandInteraction) {
      await origin.followUp(descriptions);
      return;
    }
    await origin.reply(descriptions);
  }
}
