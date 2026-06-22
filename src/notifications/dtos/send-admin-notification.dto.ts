import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendAdminNotificationDto {
  @ApiProperty({ description: 'The recipient user ID' })
  @IsMongoId()
  @IsNotEmpty()
  readonly recipientId!: string;

  @ApiProperty({ description: 'Notification title' })
  @IsString()
  @IsNotEmpty()
  readonly title!: string;

  @ApiProperty({ description: 'Notification message body' })
  @IsString()
  @IsNotEmpty()
  readonly message!: string;
}
