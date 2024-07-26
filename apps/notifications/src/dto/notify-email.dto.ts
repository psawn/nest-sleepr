import { IsEmail, IsString } from 'class-validator';
import { NotifyEmailMessage } from '@app/common';

export class NotifyEmailDto implements NotifyEmailMessage {
  @IsEmail()
  email: string;

  @IsString()
  text: string;
}
