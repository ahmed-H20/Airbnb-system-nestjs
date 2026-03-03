import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @Length(3, 20)
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @IsString()
  readonly password: string;

  @IsPhoneNumber()
  readonly phoneNumber: string;
}
