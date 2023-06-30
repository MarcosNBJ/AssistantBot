import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const config = {
  TOKEN: process.env.TOKEN,
  COMMAND_PREFIX: process.env.COMMAND_PREFIX || '!',
};

export default config;
