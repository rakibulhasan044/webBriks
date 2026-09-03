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
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server is running on: ${domainWithPort}`);

  if (nodeEnv !== 'production') {
    console.log(
      `📚 Swagger documentation: ${domainWithPort}/${apiPrefix}/docs`,
    );
    console.log(`🌍 Environment: ${nodeEnv}`);
  }
}
bootstrap();
