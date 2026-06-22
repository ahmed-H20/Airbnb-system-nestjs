import {
    IsNotEmpty,
    IsNumber,
    IsString,
    Min,
    Max,
    MinLength,
    MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateReviewDto {
    @ApiProperty({
        example: 5,
        description: 'The rating of the unit',
    })
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiProperty({
        example: 'This is a great unit',
        description: 'The comment about the unit',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(20)
    @MaxLength(1000)
    comment: string;

    @ApiProperty({
        example: '69d75cdd2f856b2abd19531f',
        description: 'The ID of the unit being reviewed',
    })
    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    unit: string;

    @ApiProperty({
        example: '6a2e748fe069cbd816c78995',
        description: 'The ID of the reservation being reviewed',
    })
    @IsNotEmpty()
    @Type(() => String)
    @IsString()
    reservation: string;
}
