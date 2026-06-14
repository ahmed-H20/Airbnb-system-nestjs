import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from 'node_modules/@nestjs/swagger/dist/decorators/api-property.decorator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsEmail({}, { message: 'Invalid email' })
  readonly email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  readonly password!: string;
}
