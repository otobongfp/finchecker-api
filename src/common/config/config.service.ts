import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { boolean } from 'boolean';
import { camelCase } from 'utils/transform-case';
import fs from 'fs';

@Injectable()
export class ConfigService extends NestConfigService {
  public readonly app: { name: string; description: string; version: string };

  constructor() {
    super();

    const packageJson = fs.readFileSync('package.json', 'utf8');
    const { name, description, version } = JSON.parse(packageJson);
    this.app = { name: camelCase(name), description, version };
  }

  get auth() {
    const jwt_secret = this.get<string>('JWT_SECRET');
    return {
      jwt_secret,
    };
  }

  get api() {
    const prefix = this.get<string>('API_PREFIX');
    return {
      prefix,
      docs: prefix ? `/${prefix}/api-docs` : '/api-docs',
    };
  }

  get node() {
    const nodeEnv = this.get<string>('NODE_ENV') || 'development';
    return {
      env: nodeEnv,
      isEnv: (env: string | string[]) =>
        typeof env === 'string' ? env === nodeEnv : env.includes(nodeEnv),
    };
  }

  get public_url() {
    const public_node_url = this.get<string>('PUBLIC_NODE_URL');
    return {
      public_node_url,
    };
  }

  get port() {
    return Number(this.get<string>('PORT') || 3000);
  }

  get redis() {
    const redisHost = this.get<string>('REDIS_HOST');
    const redisPort = this.get<string>('REDIS_PORT');

    return {
      host: redisHost,
      port: redisPort,
    };
  }

  get rabbitmq() {
    const rabbitmqUrl = this.get<string>('RABBITMQ_URL');

    return { url: rabbitmqUrl };
  }

  get database() {
    const url = this.getOrThrow<string>('DATABASE_URL');
    const port = this.get<string>('DB_PORT');
    const password = this.get<string>('DB_PASSWORD');
    const synchronize =
      this.get<boolean>('DB_SYNCHRONIZE') ??
      (this.node.isEnv('development') || this.node.isEnv('test'));

    const parsedUrl = new URL(url);
    if (port) parsedUrl.port = port;
    if (password) parsedUrl.password = password;

    return {
      type: url.replace(/:.*$/, ''),
      url: parsedUrl.toString(),
      synchronize,
    };
  }
}
