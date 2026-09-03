import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ description: 'New name', example: 'Rakib Hasan', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Optional new profile photo',
    required: false,
  })
  @IsOptional()
  photo?: any;
}
