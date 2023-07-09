import Container from 'typedi';
import { ICommand } from './types/ICommand';
import { RecordReminder } from './RecordReminder';
import { RecordRecurringReminder } from './RecordRecurringReminder';
import { ListReminders } from './ListReminders';
import { Help } from './Help';

export const Commands: ICommand[] = [
  Container.get(RecordReminder),
  Container.get(RecordRecurringReminder),
  Container.get(ListReminders),
  Container.get(Help),
];
