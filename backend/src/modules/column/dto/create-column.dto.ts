import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateColumnDto {
  @ApiProperty({ description: 'Title of the column', example: 'To Do' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'Position of the column (fractional index)', example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  position!: number;
}
