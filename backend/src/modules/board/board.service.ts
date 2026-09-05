import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MinioService } from '../minio/minio.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

import { PaginateParams } from '../../common/decorators/paginate.decorator';
import { PaginateHelper } from '../../common/helper/paginate.helper';

@Injectable()
export class BoardService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly minioService: MinioService,
  ) {}

  async create(
    userId: string,
    createBoardDto: CreateBoardDto,
    coverImage?: Express.Multer.File,
  ) {
    let coverImageUrl: string | null = null;

    if (coverImage) {
      coverImageUrl = await this.minioService.uploadFile(coverImage, 'boards');
    }

    return this.prismaService.board.create({
      data: {
        title: createBoardDto.title,
        description: createBoardDto.description,
        coverImage: coverImageUrl,
        owner: { connect: { id: userId } },
        columns: {
          create: [
            { title: 'TO_DO', position: 1000 },
            { title: 'IN_PROGRESS', position: 2000 },
            { title: 'DONE', position: 3000 },
          ],
        },
      },
      include: {
        columns: true,
      },
    });
  }

  async findAll(userId: string, paginateParams: PaginateParams) {
    const { skip, limit, search, page } = paginateParams;

    const where = {
      AND: [
        {
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
        search
          ? { title: { contains: search, mode: 'insensitive' as const } }
          : {},
      ],
    };

    const [boards, total] = await Promise.all([
      this.prismaService.board.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          owner: { select: { id: true, name: true, photo: true } },
          members: true,
        },
      }),
      this.prismaService.board.count({ where }),
    ]);

    return PaginateHelper.response(boards, total, { page, limit });
  }

  async findOne(id: string, userId: string) {
    const board = await this.prismaService.board.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true, photo: true } },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, photo: true },
            },
          },
        },
        columns: {
          orderBy: { position: 'asc' },
          include: {
            tasks: {
              orderBy: { position: 'asc' },
              include: {
                assignee: {
                  select: { id: true, name: true, email: true, photo: true },
                },
                attachments: true,
              },
            },
          },
        },
      },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    // Check if user is owner or member
    const isOwner = board.ownerId === userId;
    const isMember = board.members.some((m) => m.userId === userId);

    if (!isOwner && !isMember) {
      throw new ForbiddenException('You do not have access to this board');
    }

    return board;
  }

  async update(
    id: string,
    userId: string,
    updateBoardDto: UpdateBoardDto,
    coverImage?: Express.Multer.File,
  ) {
    // Verify ownership or membership
    const board = await this.prismaService.board.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!board) throw new NotFoundException('Board not found');

    const isOwner = board.ownerId === userId;
    const isMember = board.members.some((m) => m.userId === userId);

    if (!isOwner && !isMember) {
      throw new ForbiddenException(
        'Only the board owner or members can update it',
      );
    }

    let coverImageUrl = board.coverImage;
    if (coverImage) {
      coverImageUrl = await this.minioService.uploadFile(coverImage, 'boards');

      // Clean up old image if a new one is uploaded
      if (board.coverImage) {
        await this.minioService.deleteFile(board.coverImage);
      }
    }

    return this.prismaService.board.update({
      where: { id },
      data: {
        title: updateBoardDto.title,
        description: updateBoardDto.description,
        coverImage: coverImageUrl,
      },
    });
  }

  async remove(id: string, userId: string) {
    const board = await this.prismaService.board.findUnique({ where: { id } });
    if (!board) throw new NotFoundException('Board not found');
    if (board.ownerId !== userId)
      throw new ForbiddenException('Only the board owner can delete it');

    // Delete image from MinIO
    if (board.coverImage) {
      await this.minioService.deleteFile(board.coverImage);
    }

    await this.prismaService.board.delete({ where: { id } });

    return { success: true };
  }

  async addMember(boardId: string, currentUserId: string, email: string) {
    // Check if board exists and user is owner
    const board = await this.prismaService.board.findUnique({
      where: { id: boardId },
      include: { members: true },
    });

    if (!board) throw new NotFoundException('Board not found');
    if (board.ownerId !== currentUserId) {
      throw new ForbiddenException('Only the board owner can add members');
    }

    // Find the user to add
    const userToAdd = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!userToAdd)
      throw new NotFoundException('User with this email not found');

    if (userToAdd.id === currentUserId) {
      throw new BadRequestException('You are already the owner of this board');
    }

    // Check if already a member
    const isAlreadyMember = board.members.some(
      (m) => m.userId === userToAdd.id,
    );
    if (isAlreadyMember) {
      throw new BadRequestException('User is already a member of this board');
    }

    // Add member
    const newMember = await this.prismaService.boardMember.create({
      data: {
        boardId,
        userId: userToAdd.id,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, photo: true },
        },
      },
    });

    return newMember;
  }
}
