import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  // IsEnum,
  IsPhoneNumber,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';
// import { Role } from 'src/auth/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
  })
  @Length(3, 20)
  @IsString()
  readonly name!: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  @IsEmail()
  readonly email!: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password for the user account',
  })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @IsString()
  readonly password!: string;

  @ApiProperty({
    example: '+201012345678',
    description: 'The phone number of the user',
  })
  @IsPhoneNumber()
  readonly phoneNumber!: string;

  @ApiProperty({
    example: Role.Guest,
    description: 'The role of the user',
  })
  @IsEnum(Role)
  role?: Role;
}
