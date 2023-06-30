import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const config = {
  TOKEN: process.env.TOKEN,
  COMMAND_PREFIX: process.env.COMMAND_PREFIX || '!',
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017',
};

export default config;
