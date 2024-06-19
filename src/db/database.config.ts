import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const configService = new ConfigService();
    // テスト時はsqliteを使用
    if (process.env.NODE_ENV === 'test') {
      return {
        type: 'sqlite',
        database: ':memory:',
        entities: [Task],
        dropSchema: true,
        synchronize: true,
        logging: false,
      };
    }
    return {
      type: 'mysql',
      host: configService.get('DATABASE_HOST'),
      port: configService.get('DATABASE_PORT'),
      username: configService.get('DATABASE_USER'),
      password: configService.get('DATABASE_PASSWORD'),
      database: configService.get('DATABASE_DB'),
      entities: [Task],
      synchronize: false, // 本番環境では必ずfalse
    };
  }
}
