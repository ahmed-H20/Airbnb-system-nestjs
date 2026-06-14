import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsMongoId, IsNumber, IsString, Min } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({
    example: '64b8f1e2c9e77a001f0d3b1a',
    description: 'The ID of the unit being reserved',
  })
  @IsString()
  @IsMongoId()
  readonly unit!: string;

  @ApiProperty({
    example: 3,
    description: 'The number of days for the reservation',
  })
  @IsNumber()
  readonly numberOfDays!: number;

  @ApiProperty({
    example: 100,
    description: 'The price per night for the reservation',
  })
  @IsNumber()
  @Min(1)
  readonly price!: number;

  @ApiProperty({
    type: String,
    example: '2023-07-01T14:00:00Z',
    description: 'The check-in date for the reservation',
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  readonly checkInDate!: Date;

  @ApiProperty({
    type: String,
    example: '2023-07-04T11:00:00Z',
    description: 'The check-out date for the reservation',
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  readonly checkOutDate!: Date;
}
