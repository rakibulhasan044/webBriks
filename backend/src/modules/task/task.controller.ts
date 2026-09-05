import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../common/decorators/auth.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('columns/:columnId/tasks')
  @ResponseMessage('Task created successfully')
  create(
    @Param('columnId') columnId: string,
    @CurrentUserId() userId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.taskService.create(columnId, userId, dto);
  }

  @Patch('tasks/:id')
  @ResponseMessage('Task updated successfully')
  update(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.taskService.update(id, userId, dto);
  }

  @Delete('tasks/:id')
  @ResponseMessage('Task deleted successfully')
  remove(@Param('id') id: string, @CurrentUserId() userId: string) {
    return this.taskService.remove(id, userId);
  }

  // --- Attachments ---

  @Post('tasks/:taskId/attachments')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only images, PDF, DOC, and PPT are allowed.'), false);
      }
    }
  }))
  @ResponseMessage('Attachment added successfully')
  addAttachment(
    @Param('taskId') taskId: string,
    @CurrentUserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new Error('File is required or file type is invalid');
    return this.taskService.addAttachment(taskId, userId, file);
  }

  @Delete('tasks/:taskId/attachments/:attachmentId')
  @ResponseMessage('Attachment deleted successfully')
  removeAttachment(
    @Param('taskId') taskId: string,
    @Param('attachmentId') attachmentId: string,
    @CurrentUserId() userId: string,
  ) {
    return this.taskService.removeAttachment(taskId, attachmentId, userId);
  }
}
