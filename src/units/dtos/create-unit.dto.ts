import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';

import { Type } from 'class-transformer';
import { UnitType } from '../enums/unit-types.enum';

import { ApiProperty } from '@nestjs/swagger';

export class CreateUnitDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  readonly description!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly address!: string;

  // @IsArray()
  // @ArrayNotEmpty()
  // @IsUrl({}, { each: true })
  // readonly photos!: string[];

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  readonly costPerDay!: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly available!: boolean;

  @ApiProperty()
  @Type(() => Number)
  @IsEnum(UnitType)
  readonly unitType!: UnitType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly country!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly city!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  readonly roomCount!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  readonly adultsCount!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  readonly kidsCount!: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly hasInternetService!: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly hasKitchen!: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly hasPrivateGarage!: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly isActive!: boolean;
}
