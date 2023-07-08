import Container from 'typedi';
import DeleteReminderButton from './DeleteReminderButton';
import { IButton } from './types/IButton';

export const Buttons: IButton[] = [
  Container.get(DeleteReminderButton),
];
