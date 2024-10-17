import { Module } from '@nestjs/common';
import { TypeOrmModule as TypeOrm } from '@nestjs/typeorm';
import { TypeormConfigService } from './typeorm-config.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [
    TypeOrm.forRootAsync({
      useClass: TypeormConfigService,
      imports: [ConfigModule],
    }),
  ],
  exports: [TypeOrm],
})
export class TypeormModule {}
