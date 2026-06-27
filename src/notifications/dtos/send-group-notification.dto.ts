import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class SendGroupNotificationDto {
  @ApiProperty({
    enum: ['all', 'hosts', 'guests'],
    example: 'hosts',
    description: 'Target group: all users, only hosts, or only guests',
  })
  @IsEnum(['all', 'hosts', 'guests'], {
    message: 'group must be one of: all, hosts, guests',
  })
  group!: 'all' | 'hosts' | 'guests';

  @ApiProperty({ description: 'Notification title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'Notification message body' })
  @IsString()
  @IsNotEmpty()
  message!: string;
}
