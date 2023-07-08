import { Inject, Service } from 'typedi';
import { ButtonInteraction, CacheType } from 'discord.js';
import DeleteReminderService from '../services/DeleteReminderService';

@Service()
export default class DeleteReminderButton {
  @Inject() private deleteReminderService!: DeleteReminderService;

  public id = 'delete_reminder';

  async execute(interaction: ButtonInteraction<CacheType>) {
    const [, type, id] = interaction.customId.split('#');
    await this.deleteReminderService.execute({
      type,
      id,
    });
    await interaction.reply({ content: 'Reminder deleted', ephemeral: true });
  }
}
