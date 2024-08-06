import { IsEmpty, IsNotEmpty } from 'class-validator';

export class TextMessageDTO {
  @IsNotEmpty({ message: 'You have to specify the recipient' })
  recipient_id: string;
  @IsNotEmpty({ message: 'You cannot send an empty message' })
  text: string;
}
