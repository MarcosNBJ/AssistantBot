import {
  Client, Events,
} from 'discord.js';
import config from '../config';

const SendSingleMessage = async (message: string, channelId: string) => {
  const client = new Client({
    intents: config.BOT_INTENTS,
  });

  const clientIsReady = new Promise((resolve) => {
    client.once(Events.ClientReady, resolve);
  });

  await client.login(config.TOKEN);

  await clientIsReady;

  const channel = await client.channels.fetch(channelId);
  if (!channel?.isTextBased()) return;
  await channel.send(message);
  client.destroy();
};

export default SendSingleMessage;
