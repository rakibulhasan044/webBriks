import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ColumnTitle } from '../../../generated/prisma/enums';

export class UpdateColumnDto {
  @ApiProperty({
    description: 'Title of the column',
    enum: ColumnTitle,
    example: ColumnTitle.IN_PROGRESS,
    required: false,
  })
  @IsEnum(ColumnTitle, {
    message: 'Title must be one of the predefined column titles',
  })
  @IsOptional()
  title?: ColumnTitle;

  @ApiProperty({
    description: 'Position of the column',
    example: 2000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  position?: number;
}
