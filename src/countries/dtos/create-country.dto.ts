import { IsString, MinLength } from 'class-validator';

export class CreateCountryDto {
  @MinLength(3, { message: 'Country name must be at least 3 characters' })
  @IsString()
  readonly name: string;

  @IsString()
  readonly code: string;
}
