import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({ description: 'Title of the task', required: false })
  @IsString({
    message: 'Title must be a string',
  })
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Description of the task', required: false })
  @IsString({
    message: 'Description must be a string',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Position within the column', required: false })
  @IsNumber()
  @IsOptional()
  position?: number;

  @ApiProperty({
    description: 'Move to a different column ID',
    required: false,
  })
  @IsString({
    message: 'Column ID must be a string',
  })
  @IsOptional()
  columnId?: string;

  @ApiProperty({ description: 'Change assigned user ID', required: false })
  @IsString({
    message: 'Assignee ID must be a string',
  })
  @IsOptional()
  assigneeId?: string;
}
