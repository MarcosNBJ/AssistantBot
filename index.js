import { Client, GatewayIntentBits, Events } from 'discord.js';
import config from './config.js';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    console.log(interaction);
    if (interaction.commandName === 'ping') {
      await interaction.reply('Pong!');
    }
  });
  
// client.on('messageCreate', async message => {
//     console.log(message);
// });

client.login(config.token);

