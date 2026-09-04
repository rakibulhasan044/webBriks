import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddMemberDto } from './dto/add-member.dto';

@Injectable()
export class BoardMemberService {
  constructor(private readonly prisma: PrismaService) {}

  async addMember(boardId: string, currentUserId: string, dto: AddMemberDto) {
    // Verify board ownership
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
    });
    if (!board) throw new NotFoundException('Board not found');
    if (board.ownerId !== currentUserId)
      throw new ForbiddenException('Only the board owner can add members');

    // Find user to add
    const userToAdd = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!userToAdd)
      throw new NotFoundException('User with this email not found');

    // Cannot add the owner as a member (they are already the owner)
    if (userToAdd.id === board.ownerId)
      throw new ConflictException('User is the owner of this board');

    // Check if already a member
    const existingMember = await this.prisma.boardMember.findUnique({
      where: { boardId_userId: { boardId, userId: userToAdd.id } },
    });
    if (existingMember)
      throw new ConflictException('User is already a member of this board');

    // Add member
    return this.prisma.boardMember.create({
      data: {
        boardId,
        userId: userToAdd.id,
      },
      include: {
        user: { select: { id: true, name: true, email: true, photo: true } },
      },
    });
  }

  async getMembers(boardId: string, currentUserId: string) {
    // Check access (must be owner or member)
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      include: { members: true },
    });
    if (!board) throw new NotFoundException('Board not found');

    const hasAccess =
      board.ownerId === currentUserId ||
      board.members.some((m) => m.userId === currentUserId);
    if (!hasAccess)
      throw new ForbiddenException('You do not have access to this board');

    return this.prisma.boardMember.findMany({
      where: { boardId },
      include: {
        user: { select: { id: true, name: true, email: true, photo: true } },
      },
    });
  }

  async removeMember(
    boardId: string,
    userIdToRemove: string,
    currentUserId: string,
  ) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
    });
    if (!board) throw new NotFoundException('Board not found');

    // Only owner can remove others, but members can remove themselves (leave board)
    if (board.ownerId !== currentUserId && currentUserId !== userIdToRemove) {
      throw new ForbiddenException('Only the board owner can remove members');
    }

    const member = await this.prisma.boardMember.findUnique({
      where: { boardId_userId: { boardId, userId: userIdToRemove } },
    });
    if (!member) throw new NotFoundException('Member not found in this board');

    await this.prisma.boardMember.delete({
      where: { id: member.id },
    });

    return { success: true };
  }
}
