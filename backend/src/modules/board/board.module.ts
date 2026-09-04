import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { BoardGateway } from './board.gateway';

@Module({
  controllers: [BoardController],
  providers: [BoardService, BoardGateway],
})
export class BoardModule {}
