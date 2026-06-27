import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address associated with the account',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '1234',
    description: 'The 4-digit OTP sent to the email',
  })
  @IsString()
  @Length(4, 4, { message: 'OTP must be exactly 4 digits' })
  otp!: string;
}
