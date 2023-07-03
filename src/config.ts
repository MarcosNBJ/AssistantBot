import * as dotenv from 'dotenv';
import {
  GatewayIntentBits,
} from 'discord.js';

dotenv.config({ path: '.env' });

const config = {
  TOKEN: process.env.TOKEN,
  COMMAND_PREFIX: process.env.COMMAND_PREFIX || '!',
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017',
  BOT_INTENTS: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  REDIS: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: +(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || 'foobarbaz',
  },
};

export default config;
