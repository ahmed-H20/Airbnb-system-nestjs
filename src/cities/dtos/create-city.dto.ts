import { IsMongoId, IsString, MinLength } from 'class-validator';
import { ApiProperty } from 'node_modules/@nestjs/swagger/dist/decorators/api-property.decorator';

export class CreateCityDto {
  @ApiProperty()
  @MinLength(3, { message: 'City name must be at least 3 characters' })
  @IsString()
  readonly name!: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  readonly country!: string;
}
