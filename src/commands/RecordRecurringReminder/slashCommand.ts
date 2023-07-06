import { ChatInputCommandInteraction } from 'discord.js';
import ScheduleRecurringReminderService from '../../services/ScheduleRecurringReminderService';
import replyMessageDetail from './replyMessageDetail';

export default async function slashCommand(
  origin: ChatInputCommandInteraction,
  schedulerService: ScheduleRecurringReminderService,
) {
  const { channelId } = origin;
  const timeOfDay = origin.options.getString('time_of_day', true);
  const [hour, minute] = timeOfDay.split(':');
  const content = origin.options.getString('content', true);
  const dayOfWeek = origin.options.getInteger('day_of_week') || 0;
  const dayOfMonth = origin.options.getString('day_of_month') || '0';
  const recurrence = origin.options.getSubcommand();
  let cronExp = '';

  switch (recurrence) {
    case 'daily': {
      cronExp = `0 ${+minute || 0} ${+hour} * * *`;
      break;
    }
    case 'weekly': {
      cronExp = `0 ${+minute || 0} ${+hour} * * ${dayOfWeek}`;
      break;
    }
    case 'monthly': {
      cronExp = `0 ${+minute || 0} ${+hour} ${dayOfMonth} * *`;
      break;
    }
    default:
      break;
  }
  const replyMessage = replyMessageDetail(recurrence, {
    timeOfDay,
    dayOfMonth,
    dayOfWeek,
  });
  origin.followUp(`Recorded! I will remind you ${replyMessage}`);
  await schedulerService.execute({ channelId, content, cronExp });
}
