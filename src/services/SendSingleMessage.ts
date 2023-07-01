import {
  Client, Events, Channel,
} from 'discord.js';
import config from '../config';

const SendSingleMessage = (message: string, channelId: string) => {
  const client = new Client({
    intents: config.BOT_INTENTS,
  });

  client.once(Events.ClientReady, (c) => {
    c.channels.fetch(channelId).then((channel: Channel | null) => {
      if (!channel?.isTextBased()) return;
      channel.send(message);
    });
  });

  client.login(config.TOKEN);
};

export default SendSingleMessage;
