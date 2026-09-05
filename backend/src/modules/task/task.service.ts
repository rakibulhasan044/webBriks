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
    const task = await this.prisma.task.findUnique({ 
      where: { id: taskId },
      include: { assignees: true }
    });
    if (!task) throw new NotFoundException('Task not found');
    
    const column = await this.verifyColumnAccess(task.columnId, userId);
    
    const isOwner = column.board.ownerId === userId;
    const isAssigned = task.assignees.some(a => a.id === userId);
    const isCreator = task.creatorId === userId;
    
    if (!isOwner && !isAssigned && !isCreator) {
      throw new ForbiddenException('You can only access tasks you are assigned to or created');
    }
    
    return task;
  }

  async findMyTasks(userId: string) {
    return this.prisma.task.findMany({
      where: {
        assignees: { some: { id: userId } }
      },
      include: {
        column: {
          include: {
            board: {
              select: { id: true, title: true, coverImage: true }
            }
          }
        },
        assignees: { select: { id: true, name: true, photo: true } },
        creator: { select: { id: true, name: true, photo: true } },
        attachments: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(columnId: string, userId: string, dto: CreateTaskDto) {
    const column = await this.verifyColumnAccess(columnId, userId);

    // Auto-assign the board owner AND the task creator
    const finalAssigneeIds = new Set(dto.assigneeIds || []);
    finalAssigneeIds.add(column.board.ownerId);
    finalAssigneeIds.add(userId);

    // If assigned, verify the assignees are actually members of the board
    if (finalAssigneeIds.size > 0) {
      for (const assigneeId of Array.from(finalAssigneeIds)) {
        const isAssigneeOwner = column.board.ownerId === assigneeId;
        const isAssigneeMember = column.board.members.some(
          (m) => m.userId === assigneeId,
        );
        if (!isAssigneeOwner && !isAssigneeMember) {
          throw new BadRequestException(`Assignee ${assigneeId} must be a member of the board`);
        }
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
        columnId,
        creatorId: userId,
        assignees: {
          connect: Array.from(finalAssigneeIds).map(id => ({ id }))
        }
      },
      include: {
        assignees: { select: { id: true, name: true, photo: true } }
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
        priority: dto.priority,
        position: dto.position,
        columnId: dto.columnId,
        ...(dto.assigneeIds && {
          assignees: {
            set: dto.assigneeIds.map(id => ({ id }))
          }
        }),
      },
      include: {
        assignees: { select: { id: true, name: true, photo: true } }
      }
    });

    this.eventEmitter.emit('task.updated', { boardId, task: updatedTask });
    return updatedTask;
  }

  async remove(id: string, userId: string) {
    const task = await this.verifyTaskAccess(id, userId);
    const column = await this.prisma.column.findUnique({ 
      where: { id: task.columnId },
      include: { board: true }
    });
    
    if (!column) throw new NotFoundException('Column not found');

    const isOwner = column.board.ownerId === userId;
    const isCreator = task.creatorId === userId;

    if (!isOwner && !isCreator) {
      throw new ForbiddenException('Only the board owner or the task creator can delete this task');
    }

    // Delete attachments from MinIO before deleting the task
    const attachments = await this.prisma.taskAttachment.findMany({
      where: { taskId: id }
    });
    
    for (const att of attachments) {
      try {
        await this.minioService.deleteFile(att.url);
      } catch (e) {
        console.error(`Failed to delete file from MinIO: ${att.url}`, e);
      }
    }

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

    const currentCount = await this.prisma.taskAttachment.count({
      where: { taskId }
    });

    if (currentCount >= 3) {
      throw new BadRequestException('A task can have a maximum of 3 attachments');
    }

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

    await this.prisma.$transaction(async (tx) => {
      await tx.taskAttachment.delete({ where: { id: attachmentId } });
      await this.minioService.deleteFile(attachment.url);
    });

    return { success: true };
  }
}
