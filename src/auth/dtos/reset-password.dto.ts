import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address associated with the account',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '1234',
    description: 'The 4-digit OTP that was verified',
  })
  @IsString()
  otp!: string;

  @ApiProperty({
    example: 'newPassword123',
    description: 'The new password to set',
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  newPassword!: string;
}
