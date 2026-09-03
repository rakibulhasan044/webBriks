import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ description: 'Title of the task', example: 'Fix login bug' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'Description of the task', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Position within the column (fractional index)', example: 1000 })
  @IsNumber()
  @IsNotEmpty()
  position!: number;

  @ApiProperty({ description: 'Optional user ID to assign the task to', required: false })
  @IsString()
  @IsOptional()
  assigneeId?: string;
}
