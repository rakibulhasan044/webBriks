import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllConfigType } from '../types/config.type';

export function setupSwagger(app: INestApplication) {
  const configService = app.get(ConfigService<AllConfigType>);

  const nodeEnv = configService.get('app.nodeEnv', { infer: true });
  const apiPrefix =
    configService.get('app.apiPrefix', {
      infer: true,
    }) || 'api';
  const port =
    configService.get('app.port', {
      infer: true,
    }) || 5000;

  const rawBackendDomain =
    configService.get('app.backendDomain', {
      infer: true,
    }) || 'http://localhost';

  if (nodeEnv !== 'production') {
    // Remove trailing slash
    const cleanedBackendDomain = rawBackendDomain.replace(/\/+$/, '');

    const isLocalhost = cleanedBackendDomain.includes('localhost');

    const isIpAddress = /^https?:\/\/(\d{1,3}\.){3}\d{1,3}$/.test(
      cleanedBackendDomain,
    );

    const shouldAppendPort = isLocalhost || isIpAddress;

    // Final Base URL
    const baseUrl = shouldAppendPort
      ? `${cleanedBackendDomain}:${port}`
      : cleanedBackendDomain;

    console.log('🚀 Final Swagger Base URL:', baseUrl);

    const config = new DocumentBuilder()
      .setTitle('WebBriks Door Backend API')
      .setDescription(
        'Comprehensive API documentation for WebBriks Door Backend application',
      )
      .setVersion('1.0.0')
      .addServer(baseUrl, 'Development Server')
      .addServer('http://localhost:5003', 'Local Network Server')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      })
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
      deepScanRoutes: true,
      ignoreGlobalPrefix: false,
    });

    const swaggerOptions = {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        showRequestHeaders: true,
        tryItOutEnabled: true,
      },
      customSiteTitle: 'WebBriks Door API Documentation',
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info .title { color: #2563EB }
      `,
      customfavIcon: '/favicon.ico',
    };

    const swaggerPath = `${apiPrefix}/v1/docs`.replace(/^\/+/, '');

    SwaggerModule.setup(swaggerPath, app, document, swaggerOptions);

    console.log(`📚 Swagger documentation configured at: /${swaggerPath}`);
    console.log(`📚 Swagger JSON available at: /${swaggerPath}-json`);
  }
}
