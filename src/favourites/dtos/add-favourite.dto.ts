import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddFavouriteDto {
  @ApiProperty({ description: 'The ID of the unit to add to favourites' })
  @IsMongoId()
  @IsNotEmpty()
  readonly unitId!: string;
}
