import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'oldPassword123',
    description: 'The current password',
  })
  @IsString()
  oldPassword!: string;

  @ApiProperty({
    example: 'newPassword456',
    description: 'The new password (min 6 chars)',
  })
  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters' })
  newPassword!: string;
}
