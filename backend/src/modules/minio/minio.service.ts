import 'multer';
import {
  Injectable,
  Logger,
  OnModuleInit,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { randomUUID } from 'crypto';
import * as path from 'path';
import { MinioConfig } from '../../common/types/minioConfig.type';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private minioClient: Minio.Client;
  private minioConfig: MinioConfig;

  constructor(private readonly configService: ConfigService) {
    const config = this.configService.get<MinioConfig>('minio');
    if (!config) {
      throw new InternalServerErrorException('MinIO configuration not found');
    }
    this.minioConfig = config;

    this.minioClient = new Minio.Client({
      endPoint: this.minioConfig.endpoint,
      port: this.minioConfig.port,
      useSSL: this.minioConfig.useSSL,
      accessKey: this.minioConfig.accessKey,
      secretKey: this.minioConfig.secretKey,
    });
  }

  async onModuleInit() {
    try {
      const bucketName = this.minioConfig.defaultBucket;
      const exists = await this.minioClient.bucketExists(bucketName);

      if (!exists) {
        await this.minioClient.makeBucket(bucketName, 'us-east-1');

        // Make the bucket public so images can be served directly
        const publicPolicy = {
          Version: '2012-10-17',
          Statement: [
            {
              Action: ['s3:GetObject'],
              Effect: 'Allow',
              Principal: {
                AWS: ['*'],
              },
              Resource: [`arn:aws:s3:::${bucketName}/*`],
            },
          ],
        };
        await this.minioClient.setBucketPolicy(
          bucketName,
          JSON.stringify(publicPolicy),
        );
        this.logger.log(
          `Created bucket: ${bucketName} with public read policy`,
        );
      } else {
        this.logger.log(`Bucket ${bucketName} already exists`);
      }
    } catch (error) {
      this.logger.error('Failed to initialize MinIO bucket', error);
      // EDGE CASE 1: Throw an error to stop the server from starting with a broken storage connection
      throw new InternalServerErrorException(
        'MinIO connection failed. Check your credentials and server status.',
      );
    }
  }

  /**
   * Uploads a file buffer to MinIO
   * @param file The intercepted file from Multer
   * @param folder Optional subfolder path (e.g. 'categories')
   * @returns The public URL path to access the file
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = '',
  ): Promise<string> {
    // EDGE CASE 2: Ensure file actually exists before processing
    if (!file || !file.originalname || !file.buffer) {
      throw new InternalServerErrorException(
        'Invalid file provided for upload',
      );
    }

    const bucketName = this.minioConfig.defaultBucket;

    // EDGE CASE 3: Clean original filename to remove spaces and weird characters
    const extension = path.extname(file.originalname).toLowerCase();
    const uniqueFilename = `${randomUUID()}${extension}`;

    // EDGE CASE 4: Prevent double slashes if folder is empty
    const cleanFolder = folder ? `${folder}/` : '';
    const objectName = `${cleanFolder}${uniqueFilename}`;

    try {
      await this.minioClient.putObject(
        bucketName,
        objectName,
        file.buffer,
        file.size,
        { 'Content-Type': file.mimetype || 'application/octet-stream' }, // EDGE CASE 5: Fallback mimetype
      );

      // Return the direct access URL relative path
      return `/${bucketName}/${objectName}`;
    } catch (error) {
      this.logger.error(
        `Error uploading file ${file.originalname} to MinIO`,
        error,
      );
      throw new InternalServerErrorException(
        'Could not upload file to storage',
      );
    }
  }

  /**
   * Get the full absolute URL for frontend consumption if needed
   */
  getFileUrl(path: string): string {
    const protocol = this.minioConfig.useSSL ? 'https' : 'http';
    return `${protocol}://${this.minioConfig.endpoint}:${this.minioConfig.port}${path}`;
  }

  /**
   * Deletes a file from MinIO storage
   * @param fileUrl The relative URL path (e.g. /bucket-name/folder/file.jpg)
   */
  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl) return;

    try {
      const bucketName = this.minioConfig.defaultBucket;
      const prefix = `/${bucketName}/`;
      
      let objectName = fileUrl;
      if (fileUrl.startsWith(prefix)) {
        objectName = fileUrl.substring(prefix.length);
      }

      await this.minioClient.removeObject(bucketName, objectName);
      this.logger.log(`Deleted file: ${objectName} from bucket: ${bucketName}`);
    } catch (error) {
      this.logger.error(`Failed to delete file from MinIO: ${fileUrl}`, error);
      // Fail silently to not break database transactions if the file is already gone
    }
  }
}
