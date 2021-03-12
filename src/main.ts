import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Log4jsLogger } from '@nestx-log4js/core';
import { AppModule } from './app.module';

const listenPort = 3000;

const logger = new Logger('main.ts');

/**
 *主方法
 */
const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  /**
   * Swagger
   */
  const config = new DocumentBuilder()
    .setTitle('项目管理平台')
    .setDescription('cyq-项目管理平台-接口文档')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'jwt',
    )
    .addTag('Apis')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  /**
   * Log4
   */
  app.useLogger(app.get(Log4jsLogger));

  await app.listen(listenPort);
};
bootstrap().then(() => {
  // console.log(`http://localhost:${listenPort}`);
  logger.log(`http://localhost:${listenPort}`);
  logger.log(`http://localhost:${listenPort}/api`);
});
