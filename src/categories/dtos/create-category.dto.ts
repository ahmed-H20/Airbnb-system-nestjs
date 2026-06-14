import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @MinLength(3, { message: 'City name must be at least 3 characters' })
  @IsString()
  readonly name!: string;

  @ApiProperty()
  @IsString()
  readonly slug!: string;

  @ApiProperty()
  readonly photos?: string | null;

  @ApiProperty()
  @IsString()
  readonly description?: string | null;

  @ApiProperty()
  @IsBoolean()
  readonly isActive?: boolean | null;
}
