import { Module } from '@nestjs/common';
import { BoardMemberService } from './board-member.service';
import { BoardMemberController } from './board-member.controller';

@Module({
  controllers: [BoardMemberController],
  providers: [BoardMemberService],
})
export class BoardMemberModule {}
