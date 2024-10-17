import { Global, Module } from '@nestjs/common';
import { ConfigModule } from 'common/config/config.module';
import { ConfigService } from 'common/config/config.service';
import Redis from 'ioredis';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS',
      useFactory: (config: ConfigService) => {
        return new Redis({
          host: config.redis.host,
          port: parseInt(config.redis.port, 10),
        });
      },
      inject: [ConfigService],
    },
    ConfigModule,
  ],
  exports: ['REDIS'],
})
export class RedisModule {}
