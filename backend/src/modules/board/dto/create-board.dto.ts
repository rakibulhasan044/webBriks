import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({
    description: 'Title of the board',
    example: 'Engineering Project',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: 'Optional description of the board',
    example: 'Main board for all engineering tasks',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Optional cover image for the board',
    required: false,
  })
  @IsOptional()
  coverImage?: any;
}
