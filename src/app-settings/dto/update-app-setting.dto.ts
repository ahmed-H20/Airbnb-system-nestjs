import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateAppSettingDto {
    @ApiProperty({
        type: Number,
        required: true,
        example: 100
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    minPrice: number;

    @ApiProperty({
        type: Number,
        required: true,
        example: 14
    })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    vatRate: number;
}
