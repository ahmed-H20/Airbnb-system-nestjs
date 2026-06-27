import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ReservationStatus } from '../enums/ReservationStatus.enum';

export class CreateReservationDto {
  @ApiProperty({
    example: '64b8f1e2c9e77a001f0d3b1a',
    description: 'The ID of the unit being reserved',
  })
  @IsString()
  @IsMongoId()
  readonly unit!: string;

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

  @ApiProperty({
    example: 100,
    description: 'The price per night for the reservation',
  })
  @IsNumber()
  @Min(1)
  readonly pricePerNight!: number;

  @ApiProperty({
    example: 2,
    description: 'Total number of guests (adults + kids)',
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  readonly numberOfGuests?: number;

  // These fields exist in the schema but are typically set by the system.
  @ApiProperty({
    required: false,
    enum: ReservationStatus,
    example: ReservationStatus.PENDING,
    description: 'Reservation status (defaults to PENDING)',
  })
  @IsOptional()
  @IsEnum(ReservationStatus)
  readonly status?: ReservationStatus;
}
