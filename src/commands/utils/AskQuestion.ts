import { Message } from 'discord.js';

export const askQuestion = async (message: Message, question: string) => {
  await message.channel.send(question);
  const filter = (response: Message) => response.author.id === message.author.id;
  const collected = await message.channel.awaitMessages({
    filter, max: 1, time: 15000, errors: ['time'],
  });
  return collected.first()?.content;
};
