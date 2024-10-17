import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeormModule } from './common/typeorm/typeorm.module';
import { ConfigModule } from 'common/config/config.module';
import { RedisModule } from 'common/redis/redis.module';
import { DocModule } from 'common/doc/doc.module';
import { ReportModule } from './report/report.module';
import { RabbitMQModule } from 'common/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    TypeormModule,
    RedisModule,
    RabbitMQModule,
    ConfigModule,
    DocModule,
    ReportModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
