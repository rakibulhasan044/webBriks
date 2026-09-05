import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

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

  @ApiProperty({ description: 'Priority of the task', required: false })
  @IsOptional()
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';

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

  @ApiProperty({ description: 'Change assigned user IDs', required: false, type: [String] })
  @IsArray()
  @IsString({ each: true, message: 'Each assignee ID must be a string' })
  @IsOptional()
  assigneeIds?: string[];
}
