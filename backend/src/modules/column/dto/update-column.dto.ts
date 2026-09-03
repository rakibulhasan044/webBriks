import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateColumnDto {
  @ApiProperty({ description: 'Title of the column', example: 'In Progress', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Position of the column', example: 2000, required: false })
  @IsNumber()
  @IsOptional()
  position?: number;
}
