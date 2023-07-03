import 'reflect-metadata';
import {
  Client, Events,
} from 'discord.js';
import mongoose from 'mongoose';
import config from './config';
import { Commands } from './commands';

const client = new Client({
  intents: config.BOT_INTENTS,
});

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  client?.application?.commands.set(Commands);
  mongoose.connect(config.DATABASE_URL).then(
    () => console.log('Connected to database'),
  ).catch((erros) => console.log(`Database connection failed - ${erros}`));
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const slashCommand = Commands.find((c) => c.name === interaction.commandName);
  if (!slashCommand) {
    interaction.followUp({ content: 'An error has occurred' });
    return;
  }

  await interaction.deferReply();

  slashCommand.run(interaction);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.COMMAND_PREFIX)) return;

  const args = message.content.slice(config.COMMAND_PREFIX.length).trim().split(/ +/g);
  const command = args.shift()?.toLowerCase();

  if (!command) return;

  const slashCommand = Commands.find((c) => c.name === command);
  if (!slashCommand) {
    message.reply('An error has occurred');
    return;
  }

  slashCommand.run(message);
});

client.login(config.TOKEN);
