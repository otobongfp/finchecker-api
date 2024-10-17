import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '../config/config.service';

@Injectable()
export class TypeormConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.config.database.type as TypeOrmModuleOptions['type'],
      url: this.config.database.url,
      schema: this.config.node.isEnv('test') ? 'test' : 'public',
      dropSchema: this.config.node.isEnv('test'),
      synchronize: this.config.database.synchronize,
      autoLoadEntities: true,
    };
  }
}
