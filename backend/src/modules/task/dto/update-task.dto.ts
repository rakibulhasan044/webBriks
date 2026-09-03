import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({ description: 'Title of the task', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Description of the task', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Position within the column', required: false })
  @IsNumber()
  @IsOptional()
  position?: number;

  @ApiProperty({ description: 'Move to a different column ID', required: false })
  @IsString()
  @IsOptional()
  columnId?: string;

  @ApiProperty({ description: 'Change assigned user ID', required: false })
  @IsString()
  @IsOptional()
  assigneeId?: string;
}
