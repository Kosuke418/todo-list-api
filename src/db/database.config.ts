import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from './entities/user.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const configService = new ConfigService();
    // テスト時はsqliteを使用
    if (process.env.NODE_ENV === 'test') {
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
      host: 'todo_database',
      port: configService.get('DATABASE_PORT'),
      username: configService.get('DATABASE_USER'),
      password: configService.get('DATABASE_PASSWORD'),
      database: configService.get('DATABASE_DB'),
      entities: [User, Task],
      synchronize: false, // 本番環境では必ずfalse
    };
  }
}
