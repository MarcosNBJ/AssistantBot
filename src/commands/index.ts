import Container from 'typedi';
import { ICommand } from './types/ICommand';
import { RecordReminder } from './RecordReminder';
import { RecordRecurringReminder } from './RecordRecurringReminder';

export const Commands: ICommand[] = [
  Container.get(RecordReminder),
  Container.get(RecordRecurringReminder),
];
