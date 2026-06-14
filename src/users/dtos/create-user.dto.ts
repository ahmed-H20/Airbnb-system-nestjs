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
  @ApiProperty()
  @Length(3, 20)
  @IsString()
  readonly name!: string;

  @ApiProperty()
  @IsEmail()
  readonly email!: string;

  @ApiProperty()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @IsString()
  readonly password!: string;

  @ApiProperty()
  @IsPhoneNumber()
  readonly phoneNumber!: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role?: Role;
}
