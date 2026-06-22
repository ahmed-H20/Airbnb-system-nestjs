import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../enums/notification-type.enum';

export class CreateNotificationDto {
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

  @ApiProperty({ enum: NotificationType, description: 'Type of notification' })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  readonly type!: NotificationType;

  @ApiProperty({
    description: 'Related reservation ID (optional)',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  readonly reservationId?: string;
}
