import { IsOptional, IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsOptional()
  readonly isSuperAdmin: boolean;
}
