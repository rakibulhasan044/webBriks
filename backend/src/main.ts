import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './common/setup/swagger.setup';
import { setupGlobalConfig } from './common/setup/global.setup';
import { AllConfigType } from './common/types/config.type';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Enable CORS for frontend integration
  app.enableCors();

  const configService = app.get(ConfigService<AllConfigType>);

  const nodeEnv = configService.get('app.nodeEnv', { infer: true });

  const port =
    configService.get('app.port', {
      infer: true,
    }) || 6001;

  const backendDomain =
    configService.get('app.backendDomain', {
      infer: true,
    }) || 'http://localhost';

  const apiPrefix =
    configService.getOrThrow('app.apiPrefix', {
      infer: true,
    }) || 'api';

  const domainWithPort = `${backendDomain}:${port}`;

  // Setup global configuration
  setupGlobalConfig(app);

  setupSwagger(app);

  // Graceful shutdown handlers
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');

    (async () => {
      await app.close();
      process.exit(0);
    })().catch((error) => {
      console.error('Error during graceful shutdown:', error);
      process.exit(1);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');

    (async () => {
      await app.close();
      process.exit(0);
    })().catch((error) => {
      console.error('Error during graceful shutdown:', error);
      process.exit(1);
    });
  });

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });

  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server is running on: ${domainWithPort}`);

  if (nodeEnv !== 'production') {
    console.log(
      `📚 Swagger documentation: ${domainWithPort}/${apiPrefix}/v1/docs`,
    );
    console.log(`🌍 Environment: ${nodeEnv}`);
  }
}

bootstrap().catch((error) => {
  console.error('❌ Error starting the application:', error);
  process.exit(1);
});
