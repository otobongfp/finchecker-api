import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from 'common/config/config.service';
import { INestApplication } from '@nestjs/common';
import cookie from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function swagger(app: INestApplication, config: ConfigService) {
  const prefix = config.api.prefix ? `${config.api.prefix}` : '';
  const configuration = new DocumentBuilder()
    .setTitle(config.app.name)
    .setDescription(config.app.description)
    .setVersion(config.app.version)
    .build();
  const document = SwaggerModule.createDocument(app, configuration);
  SwaggerModule.setup(config.api.docs, app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  const config = app.get<ConfigService>(ConfigService);

  if (config.api.prefix) {
    app.setGlobalPrefix(config.api.prefix);
  }

  app.enableCors();
  app.use(cookie());

  swagger(app, config);

  const rabbitmqUrl = config.get('RABBITMQ_URL') || 'amqp://localhost:5672';
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: 'financial_reports_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}

bootstrap();
