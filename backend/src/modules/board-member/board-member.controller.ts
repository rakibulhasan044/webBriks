import { Controller, Post, Get, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BoardMemberService } from './board-member.service';
import { AddMemberDto } from './dto/add-member.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../common/decorators/auth.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@ApiTags('Board Members')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('boards/:boardId/members')
export class BoardMemberController {
  constructor(private readonly boardMemberService: BoardMemberService) {}

  @Post()
  @ResponseMessage('Member added successfully')
  addMember(
    @Param('boardId') boardId: string,
    @CurrentUserId() userId: string,
    @Body() dto: AddMemberDto,
  ) {
    return this.boardMemberService.addMember(boardId, userId, dto);
  }

  @Get()
  @ResponseMessage('Members retrieved successfully')
  getMembers(
    @Param('boardId') boardId: string,
    @CurrentUserId() userId: string,
  ) {
    return this.boardMemberService.getMembers(boardId, userId);
  }

  @Delete(':userId')
  @ResponseMessage('Member removed successfully')
  removeMember(
    @Param('boardId') boardId: string,
    @Param('userId') userIdToRemove: string,
    @CurrentUserId() userId: string,
  ) {
    return this.boardMemberService.removeMember(boardId, userIdToRemove, userId);
  }
}
