import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateCurrencyDto {
    @ApiProperty({
        example: 'US Dollar',
        description: 'Full name of the currency',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        example: 'USD',
        description: 'Currency code (e.g., USD, EUR)',
    })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.toUpperCase())
    code: string;

    @ApiProperty({
        example: '$',
        description: 'Currency symbol',
    })
    @IsNotEmpty()
    @IsString()
    symbol: string;

    @ApiProperty({
        example: 1.0,
        description: 'Exchange rate relative to a base currency -> dollar(e.g., 1.0 for base)',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    rate?: number;
}
