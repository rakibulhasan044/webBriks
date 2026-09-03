import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './common/config/app.config';
import { minioConfig, fileConfig } from './common/config/file.config';
import * as path from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { MinioModule } from './modules/minio/minio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, minioConfig, fileConfig],
      envFilePath: path.resolve(__dirname, '../../.env'),
    }),
    PrismaModule,
    AuthModule,
    MinioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
