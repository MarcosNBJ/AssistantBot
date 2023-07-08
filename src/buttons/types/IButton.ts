import { ButtonInteraction, CacheType } from 'discord.js';

export interface IButton {
  id: string;
  execute: (interaction: ButtonInteraction<CacheType>) => Promise<void>;
}
