import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { MinioModule } from './modules/minio/minio.module';
import { BoardModule } from './modules/board/board.module';
import { BoardMemberModule } from './modules/board-member/board-member.module';
import { ColumnModule } from './modules/column/column.module';
import { TaskModule } from './modules/task/task.module';
import appConfig from './config/app.config';
import { fileConfig, minioConfig } from './config/file.config';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, minioConfig, fileConfig],
      envFilePath: path.resolve(__dirname, '../../.env'),
    }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    AuthModule,
    MinioModule,
    BoardModule,
    BoardMemberModule,
    ColumnModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
