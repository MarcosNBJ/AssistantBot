import { Message } from 'discord.js';

export const askQuestion = async (message: Message, question: string, options?:{
  optional?: boolean,
}) => {
  await message.channel.send(question);
  const filter = (response: Message) => response.author.id === message.author.id;
  const collected = await message.channel.awaitMessages({
    filter, max: 1, time: 15000, errors: ['time'],
  }).catch(() => {
    if (!options?.optional) {
      throw new Error('Wait time was too long. Please try again!', {
        cause: 'Message not answered in time',
      });
    }
  });
  return collected?.first()?.content || '';
};
