import { registerAs } from '@nestjs/config';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  IsNotEmpty,
} from 'class-validator';
import validateConfig from './validate.config';
import { FileConfig, MinioConfig } from '../types/minioConfig.type';
import { Type } from 'class-transformer';

class MinioEnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  MINIO_ENDPOINT: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  @IsNotEmpty()
  MINIO_PORT: number;

  @IsBoolean()
  @IsOptional()
  MINIO_USE_SSL?: boolean;

  @IsString()
  @IsNotEmpty()
  MINIO_ACCESS_KEY: string;

  @IsString()
  @IsNotEmpty()
  MINIO_SECRET_KEY: string;

  @IsString()
  @IsNotEmpty()
  MINIO_DEFAULT_BUCKET: string;
}

class FileEnvironmentVariablesValidator {
  @IsInt()
  @Min(1024) // 1KB minimum
  @Max(1073741824) // 1GB maximum
  @IsOptional()
  MAX_FILE_SIZE?: number;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  MAX_FILES_PER_REQUEST?: number;

  @IsString()
  @IsOptional()
  ALLOWED_FILE_TYPES?: string;

  @IsBoolean()
  @IsOptional()
  COMPRESSION_ENABLED?: boolean;

  @IsInt()
  @Min(10)
  @Max(100)
  @IsOptional()
  COMPRESSION_QUALITY?: number;

  @IsBoolean()
  @IsOptional()
  THUMBNAIL_ENABLED?: boolean;

  @IsInt()
  @Min(1)
  @Max(365)
  @IsOptional()
  FILE_CLEANUP_DAYS?: number;
}

export const minioConfig = registerAs('minio', (): MinioConfig => {
  validateConfig(process.env, MinioEnvironmentVariablesValidator);

  return {
    endpoint: process.env.MINIO_ENDPOINT!,
    port: parseInt(process.env.MINIO_PORT!, 10),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY!,
    secretKey: process.env.MINIO_SECRET_KEY!,
    defaultBucket: process.env.MINIO_DEFAULT_BUCKET!,
  };
});

export const fileConfig = registerAs('file', (): FileConfig => {
  validateConfig(process.env, FileEnvironmentVariablesValidator);

  const defaultMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/avif',
    'image/heic',
    'image/heif',
  ];

  return {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800', 10), // 50MB
    allowedMimeTypes:
      process.env.ALLOWED_FILE_TYPES?.split(',').map((type) => type.trim()) ||
      defaultMimeTypes,
    compressionEnabled: process.env.COMPRESSION_ENABLED === 'true',
    compressionQuality: parseInt(process.env.COMPRESSION_QUALITY || '80', 10),
    thumbnailEnabled: process.env.THUMBNAIL_ENABLED === 'true',
    cleanupDays: parseInt(process.env.FILE_CLEANUP_DAYS || '30', 10),
    maxFilesPerRequest: parseInt(process.env.MAX_FILES_PER_REQUEST || '10', 10),
  };
});
