export type MinioConfig = {
  endpoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  defaultBucket: string;
};

export type FileConfig = {
  maxFileSize: number;
  allowedMimeTypes: string[];
  compressionEnabled: boolean;
  compressionQuality: number;
  thumbnailEnabled: boolean;
  cleanupDays: number;
  maxFilesPerRequest: number;
};
