import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateColumnDto {
  @ApiProperty({
    description: 'Title of the column',
    example: 'To Do',
  })
  @IsString({
    message: 'Title must be a string',
  })
  @IsNotEmpty({
    message: 'Title can not be empty',
  })
  title!: string;

  @ApiProperty({
    description: 'Position of the column (fractional index)',
    example: 1000,
  })
  @IsNumber()
  @IsNotEmpty({
    message: 'Position can not be empty',
  })
  position!: number;
}
