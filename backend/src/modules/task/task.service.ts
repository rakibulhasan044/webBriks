import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { MinioService } from '../minio/minio.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minioService: MinioService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // Helper to check access via columnId
  private async verifyColumnAccess(columnId: string, userId: string) {
    const column = await this.prisma.column.findUnique({
      where: { id: columnId },
      include: { board: { include: { members: true } } },
    });
    if (!column) throw new NotFoundException('Column not found');

    const isOwner = column.board.ownerId === userId;
    const isMember = column.board.members.some((m) => m.userId === userId);

    if (!isOwner && !isMember) {
      throw new ForbiddenException('You do not have access to this board');
    }

    return column;
  }

  // Helper to check access via taskId
  private async verifyTaskAccess(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');
    await this.verifyColumnAccess(task.columnId, userId);
    return task;
  }

  async create(columnId: string, userId: string, dto: CreateTaskDto) {
    const column = await this.verifyColumnAccess(columnId, userId);

    // If assigned, verify the assignee is actually a member of the board
    if (dto.assigneeId) {
      const isAssigneeOwner = column.board.ownerId === dto.assigneeId;
      const isAssigneeMember = column.board.members.some(
        (m) => m.userId === dto.assigneeId,
      );
      if (!isAssigneeOwner && !isAssigneeMember) {
        throw new BadRequestException('Assignee must be a member of the board');
      }
    }

    // Auto-calculate position if not provided (place at bottom)
    let position = dto.position;
    if (position === undefined) {
      const lastTask = await this.prisma.task.findFirst({
        where: { columnId },
        orderBy: { position: 'desc' },
      });
      position = lastTask ? lastTask.position + 1000 : 1000;
    }

    const newTask = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        priority: dto.priority || 'MEDIUM',
        position,
        assigneeId: dto.assigneeId,
        columnId,
      },
      include: {
        assignee: { select: { id: true, name: true, photo: true } }
      }
    });

    this.eventEmitter.emit('task.created', { boardId: column.boardId, task: newTask });
    return newTask;
  }

  async update(id: string, userId: string, dto: UpdateTaskDto) {
    const task = await this.verifyTaskAccess(id, userId);

    let boardId = '';
    // If changing column, verify access to the new column
    if (dto.columnId && dto.columnId !== task.columnId) {
      const newColumn = await this.verifyColumnAccess(dto.columnId, userId);
      boardId = newColumn.boardId;
    } else {
      const column = await this.prisma.column.findUnique({ where: { id: task.columnId } });
      boardId = column!.boardId;
    }

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        position: dto.position,
        columnId: dto.columnId,
        assigneeId: dto.assigneeId,
      },
      include: {
        assignee: { select: { id: true, name: true, photo: true } }
      }
    });

    this.eventEmitter.emit('task.updated', { boardId, task: updatedTask });
    return updatedTask;
  }

  async remove(id: string, userId: string) {
    const task = await this.verifyTaskAccess(id, userId);
    const column = await this.prisma.column.findUnique({ where: { id: task.columnId } });

    await this.prisma.task.delete({ where: { id } });

    if (column) {
      this.eventEmitter.emit('task.deleted', { boardId: column.boardId, taskId: id });
    }
    
    return { success: true };
  }

  // --- Attachments ---

  async addAttachment(
    taskId: string,
    userId: string,
    file: Express.Multer.File,
  ) {
    await this.verifyTaskAccess(taskId, userId);
    if (!file) throw new BadRequestException('No file provided');

    const url = await this.minioService.uploadFile(file, 'task-attachments');

    return this.prisma.taskAttachment.create({
      data: {
        filename: file.originalname,
        url,
        taskId,
      },
    });
  }

  async removeAttachment(taskId: string, attachmentId: string, userId: string) {
    await this.verifyTaskAccess(taskId, userId);

    const attachment = await this.prisma.taskAttachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment || attachment.taskId !== taskId) {
      throw new NotFoundException('Attachment not found');
    }

    await this.minioService.deleteFile(attachment.url);
    await this.prisma.taskAttachment.delete({ where: { id: attachmentId } });

    return { success: true };
  }
}
