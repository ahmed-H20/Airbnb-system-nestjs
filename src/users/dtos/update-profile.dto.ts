import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The display name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  name?: string;

  @ApiProperty({
    example: '+201012345678',
    description: 'Phone number of the user',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiProperty({
    example: 'https://example.com/photo.jpg',
    description: 'URL of the profile picture',
    required: false,
  })
  @IsOptional()
  @IsString()
  profilePicture?: string;
}
