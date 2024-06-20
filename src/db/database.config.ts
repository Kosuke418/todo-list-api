import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from './entities/user.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    // テスト時はsqliteを使用
    if (this.configService.get('NODE_ENV') === 'test') {
      return {
        type: 'sqlite',
        database: ':memory:',
        entities: [User, Task],
        dropSchema: true,
        synchronize: true,
        logging: false,
      };
    }
    return {
      type: 'mysql',
      host: this.configService.get('DATABASE_HOST'),
      port: this.configService.get('DATABASE_PORT'),
      username: this.configService.get('DATABASE_USER'),
      password: this.configService.get('DATABASE_PASSWORD'),
      database: this.configService.get('DATABASE_DB'),
      entities: [User, Task],
      synchronize: false, // 本番環境では必ずfalse
    };
  }
}
