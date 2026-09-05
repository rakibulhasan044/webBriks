import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum, IsArray } from 'class-validator';
import { TaskPriority } from '../../../generated/prisma/enums';

export class CreateTaskDto {
  @ApiProperty({ description: 'Title of the task', example: 'Fix login bug' })
  @IsString({
    message: 'Title must be a string',
  })
  @IsNotEmpty({
    message: 'Title can not be empty',
  })
  title!: string;

  @ApiProperty({ description: 'Description of the task', required: false })
  @IsString({
    message: 'Description must be a string',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Priority of the task',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
    required: false
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({
    description: 'Position within the column (fractional index)',
    example: 1000,
  })
  @IsNumber()
  @IsOptional()
  position?: number;

  @ApiProperty({
    description: 'Optional list of user IDs to assign the task to',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  assigneeIds?: string[];
}
