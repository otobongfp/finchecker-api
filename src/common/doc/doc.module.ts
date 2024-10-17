import { Module } from '@nestjs/common';
import { DocService } from './doc.service';
import { RedisModule } from 'common/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [DocService],
  exports: [DocService],
})
export class DocModule {}
