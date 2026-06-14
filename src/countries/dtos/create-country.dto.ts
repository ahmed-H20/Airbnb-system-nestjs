import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from 'node_modules/@nestjs/swagger/dist/decorators/api-property.decorator';

export class CreateCountryDto {
  @ApiProperty()
  @MinLength(3, { message: 'Country name must be at least 3 characters' })
  @IsString()
  readonly name!: string;

  @ApiProperty()
  @IsString()
  readonly code!: string;
}
