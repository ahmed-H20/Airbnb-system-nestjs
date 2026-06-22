import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveFavouriteDto {
  @ApiProperty({ description: 'The ID of the unit to remove from favourites' })
  @IsMongoId()
  @IsNotEmpty()
  readonly unitId!: string;
}
