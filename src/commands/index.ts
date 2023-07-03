import Container from 'typedi';
import { ICommand } from './types/ICommand';
import { RecordReminder } from './RecordReminder';

export const Commands: ICommand[] = [Container.get(RecordReminder)];
