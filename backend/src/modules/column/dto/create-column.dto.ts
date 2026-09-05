import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ColumnTitle } from '../../../generated/prisma/enums';

export class CreateColumnDto {
  @ApiProperty({
    description: 'Title of the column from the available enum',
    enum: ColumnTitle,
    example: ColumnTitle.TO_DO,
  })
  @IsEnum(ColumnTitle, {
    message: 'Title must be one of the predefined column titles',
  })
  @IsNotEmpty({
    message: 'Title can not be empty',
  })
  title!: ColumnTitle;

  @ApiProperty({
    description: 'Position of the column (fractional index)',
    example: 1000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  position?: number;
}
