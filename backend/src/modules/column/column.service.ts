import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnService {
  constructor(private readonly prisma: PrismaService) {}

  // Helper to check if user has access to the board
  private async verifyBoardAccess(boardId: string, userId: string) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      include: { members: true },
    });
    if (!board) throw new NotFoundException('Board not found');

    const isOwner = board.ownerId === userId;
    const isMember = board.members.some((m) => m.userId === userId);

    if (!isOwner && !isMember) {
      throw new ForbiddenException('You do not have access to this board');
    }

    return board;
  }

  // Helper to check access via columnId
  private async verifyColumnAccess(columnId: string, userId: string) {
    const column = await this.prisma.column.findUnique({
      where: { id: columnId },
    });
    if (!column) throw new NotFoundException('Column not found');
    await this.verifyBoardAccess(column.boardId, userId);
    return column;
  }

  async create(boardId: string, userId: string, dto: CreateColumnDto) {
    await this.verifyBoardAccess(boardId, userId);

    // Enforce uniqueness: there can be only one column with the title per board
    const existingColumn = await this.prisma.column.findFirst({
      where: {
        boardId,
        title: dto.title
      }
    });

    if (existingColumn) {
      throw new BadRequestException(`A column with the title "${dto.title}" already exists on this board`);
    }

    // Auto-calculate position if not provided
    let position = dto.position;
    if (position === undefined) {
      const lastColumn = await this.prisma.column.findFirst({
        where: { boardId },
        orderBy: { position: 'desc' },
      });
      position = lastColumn ? lastColumn.position + 1000 : 1000;
    }

    return this.prisma.column.create({
      data: {
        title: dto.title,
        position,
        boardId,
      },
    });
  }

  async findAll(boardId: string, userId: string) {
    const board = await this.verifyBoardAccess(boardId, userId);

    const columns = await this.prisma.column.findMany({
      where: { boardId },
      orderBy: { position: 'asc' },
      include: {
        tasks: {
          orderBy: { position: 'asc' },
          include: {
            assignees: { select: { id: true, name: true, photo: true } },
          },
        },
      },
    });

    const isOwner = board.ownerId === userId;
    if (!isOwner) {
      columns.forEach(column => {
        column.tasks = column.tasks.filter(task => 
          task.assignees.some(assignee => assignee.id === userId)
        );
      });
    }

    return columns;
  }

  async update(id: string, userId: string, dto: UpdateColumnDto) {
    await this.verifyColumnAccess(id, userId);

    return this.prisma.column.update({
      where: { id },
      data: {
        title: dto.title,
        position: dto.position,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.verifyColumnAccess(id, userId);

    await this.prisma.column.delete({ where: { id } });
    return { success: true };
  }
}
