import WeekDays from '../utils/WeekDays';

export default function replyMessageDetail(
  recurrence: string,
  detail: {
    timeOfDay: string,
    dayOfWeek?: number,
    dayOfMonth?: string,
  },
) {
  if (recurrence === 'daily') {
    return `every day at ${detail.timeOfDay}`;
  }
  if (recurrence === 'weekly') {
    return `every ${WeekDays().find((day) => day.value === detail.dayOfWeek)?.name} at ${detail.timeOfDay}`;
  }
  return `every day ${detail.dayOfMonth} of each month, at ${detail.timeOfDay}`;
}
