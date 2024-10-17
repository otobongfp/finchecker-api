import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { EmailModule } from 'common/email/email.module';
import { RedisService } from 'common/redis/redis.service';
import { DocService } from 'common/doc/doc.service';
import { EmailService } from 'common/email/email.service';
import { RabbitMQModule } from 'common/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMQModule],
  controllers: [ReportController],
  providers: [ReportService, RedisService, DocService, EmailService],
})
export class ReportModule {}
