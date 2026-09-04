import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../common/decorators/auth.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@ApiTags('Columns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Post('boards/:boardId/columns')
  @ResponseMessage('Column created successfully')
  create(
    @Param('boardId') boardId: string,
    @CurrentUserId() userId: string,
    @Body() dto: CreateColumnDto,
  ) {
    return this.columnService.create(boardId, userId, dto);
  }

  @Get('boards/:boardId/columns')
  @ResponseMessage('Columns retrieved successfully')
  findAll(@Param('boardId') boardId: string, @CurrentUserId() userId: string) {
    return this.columnService.findAll(boardId, userId);
  }

  @Patch('columns/:id')
  @ResponseMessage('Column updated successfully')
  update(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
    @Body() dto: UpdateColumnDto,
  ) {
    return this.columnService.update(id, userId, dto);
  }

  @Delete('columns/:id')
  @ResponseMessage('Column deleted successfully')
  remove(@Param('id') id: string, @CurrentUserId() userId: string) {
    return this.columnService.remove(id, userId);
  }
}
