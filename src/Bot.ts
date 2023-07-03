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
  const command = Commands.find((c) => c.name === interaction.commandName);
  if (!command) {
    interaction.followUp({ content: 'An error has occurred' });
    return;
  }

  await interaction.deferReply();

  command.run(interaction);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.COMMAND_PREFIX)) return;

  const args = message.content.slice(config.COMMAND_PREFIX.length).trim().split(/ +/g);
  const commandName = args.shift()?.toLowerCase();

  if (!commandName) return;

  const command = Commands.find((c) => c.name === commandName);
  if (!command) {
    message.reply('An error has occurred');
    return;
  }

  command.run(message);
});

client.login(config.TOKEN);
