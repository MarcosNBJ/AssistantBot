import { Message } from 'discord.js';
import { askQuestion } from '../utils/AskQuestion';
import WeekDays from '../utils/WeekDays';
import replyMessageDetail from './replyMessageDetail';
import ScheduleRecurringReminderService from '../../services/ScheduleRecurringReminderService';

export default async function chatCommand(
  origin: Message,
  schedulerService: ScheduleRecurringReminderService,
) {
  const { channelId } = origin;
  const recurrence = await askQuestion(origin, 'What is the recurrence of the reminder? (daily, weekly, monthly)');
  const content = await askQuestion(origin, 'What is the content of the reminder?');
  const timeOfDay = await askQuestion(origin, 'What time of day? (HH:MM, 24h)') || '00:00';
  const [hour, minute] = timeOfDay.split(':');
  let dayOfWeek: number | undefined;
  let dayOfMonth: string | undefined;
  let cronExp = '';

  switch (recurrence) {
    case 'daily': {
      cronExp = `0 ${+minute || 0} ${+hour} * * *`;
      break;
    }
    case 'weekly': {
      const weekDayName = await askQuestion(origin, 'In what day of the week would you like to be reminded? (Sunday, Monday, etc.)');
      dayOfWeek = WeekDays().find(
        (day) => day.name === weekDayName?.toLocaleLowerCase(),
      )?.value;
      cronExp = `0 ${+minute || 0} ${+hour} * * ${dayOfWeek}`;
      break;
    }
    case 'monthly': {
      dayOfMonth = await askQuestion(origin, 'In what day of the month would you like to be reminded? (1-31)');
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
  origin.reply(`Recorded! I will remind you ${replyMessage}`);
  await schedulerService.execute({ channelId, content, cronExp });
}
