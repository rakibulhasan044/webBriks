import {
  Controller,
  Get,
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
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../common/decorators/auth.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import {
  Paginate,
  type PaginateParams,
} from '../../common/decorators/paginate.decorator';

@ApiTags('Boards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('coverImage'))
  @ResponseMessage('Board created successfully')
  create(
    @CurrentUserId() userId: string,
    @Body() createBoardDto: CreateBoardDto,
    @UploadedFile() coverImage?: Express.Multer.File,
  ) {
    return this.boardService.create(userId, createBoardDto, coverImage);
  }

  @Get()
  @ResponseMessage('Boards retrieved successfully')
  findAll(
    @CurrentUserId() userId: string,
    @Paginate() paginateParams: PaginateParams,
  ) {
    return this.boardService.findAll(userId, paginateParams);
  }

  @Get(':id')
  @ResponseMessage('Board details retrieved successfully')
  findOne(@Param('id') id: string, @CurrentUserId() userId: string) {
    return this.boardService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('coverImage'))
  @ResponseMessage('Board updated successfully')
  update(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
    @Body() updateBoardDto: UpdateBoardDto,
    @UploadedFile() coverImage?: Express.Multer.File,
  ) {
    return this.boardService.update(id, userId, updateBoardDto, coverImage);
  }

  @Delete(':id')
  @ResponseMessage('Board deleted successfully')
  remove(@Param('id') id: string, @CurrentUserId() userId: string) {
    return this.boardService.remove(id, userId);
  }

  @Post(':id/members')
  @ResponseMessage('Member added successfully')
  addMember(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
    @Body() dto: AddMemberDto,
  ) {
    return this.boardService.addMember(id, userId, dto.email);
  }
}
