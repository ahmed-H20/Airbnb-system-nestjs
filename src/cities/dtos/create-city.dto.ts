import { IsMongoId, IsString, MinLength } from 'class-validator';

export class CreateCityDto {
  @MinLength(3, { message: 'City name must be at least 3 characters' })
  @IsString()
  readonly name: string;

  @IsString()
  @IsMongoId()
  readonly country: string;
}
