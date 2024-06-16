import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // APIのURIをすべて/apiから始まるようにする
  app.setGlobalPrefix('api');

  // CORS対応
  app.enableCors();

  // Swagger拡張の有効化
  const options = new DocumentBuilder()
    .setTitle('API description')
    .setVersion('1.0')
    .addServer('/')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  if (process.env.EXPORT_SPECIFICATION) {
    fs.writeFileSync(
      './api/specification.json',
      JSON.stringify(document, null, 2),
    );
    process.exit(0);
  }

  await app.listen(3000);
}
bootstrap();
