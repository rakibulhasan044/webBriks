import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MinioService } from '../minio/minio.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly minioService: MinioService,
  ) {}

  async create(userId: string, createBoardDto: CreateBoardDto, coverImage?: Express.Multer.File) {
    let coverImageUrl: string | null = null;
    
    if (coverImage) {
      coverImageUrl = await this.minioService.uploadFile(coverImage, 'boards');
    }

    return this.prismaService.board.create({
      data: {
        title: createBoardDto.title,
        description: createBoardDto.description,
        coverImage: coverImageUrl,
        ownerId: userId,
        columns: {
          create: [
            { title: 'To Do', position: 1000 },
            { title: 'In Progress', position: 2000 },
            { title: 'Done', position: 3000 },
          ]
        }
      },
      include: {
        columns: true
      }
    });
  }

  async findAll(userId: string) {
    // For now, return boards owned by the user or where they are a member
    return this.prismaService.board.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string, userId: string) {
    const board = await this.prismaService.board.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true, photo: true } },
        members: { include: { user: { select: { id: true, name: true, email: true, photo: true } } } },
        columns: { orderBy: { position: 'asc' } },
      },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    // Check if user is owner or member
    const isOwner = board.ownerId === userId;
    const isMember = board.members.some(m => m.userId === userId);

    if (!isOwner && !isMember) {
      throw new ForbiddenException('You do not have access to this board');
    }

    return board;
  }

  async update(id: string, userId: string, updateBoardDto: UpdateBoardDto, coverImage?: Express.Multer.File) {
    // Verify ownership or membership
    const board = await this.prismaService.board.findUnique({ 
      where: { id },
      include: { members: true } 
    });
    
    if (!board) throw new NotFoundException('Board not found');
    
    const isOwner = board.ownerId === userId;
    const isMember = board.members.some(m => m.userId === userId);

    if (!isOwner && !isMember) {
      throw new ForbiddenException('Only the board owner or members can update it');
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
    if (board.ownerId !== userId) throw new ForbiddenException('Only the board owner can delete it');

    // Delete image from MinIO
    if (board.coverImage) {
      await this.minioService.deleteFile(board.coverImage);
    }

    await this.prismaService.board.delete({ where: { id } });
    
    return { success: true };
  }
}
