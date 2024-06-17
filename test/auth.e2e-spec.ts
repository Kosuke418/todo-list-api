import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { mockJwtService } from './mock/jwt.mock';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JwtService)
      .useValue(mockJwtService())
      .compile();

    // Nestアプリケーションの起動
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  // ユーザー登録~更新のテストスイートを実行
  it('/signup (POST)', async () => {
    return await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ username: 'aa', password: '423521523521' })
      .expect(201);
  });

  // ユーザー登録~更新のテストスイートを実行
  // it('/signin (POST)', async () => {
  //   const response = await request(app.getHttpServer())
  //     .post('/auth/signin')
  //     .send({ username: 'aa', password: '423521523521' })
  //     .expect(201);

  //   expect(response.body.token).toBe('mocked-jwt-token');
  // });

  afterAll(async () => {
    // テスト後にトランザクションをロールバックし、接続を閉じる
    // await connection.rollbackTransaction();
    await app.close();
    await moduleFixture.close();
  });

  // テストで起動したNestアプリを終了しないとJestで警告が発生するため、以下のコードで終了
  afterEach(async () => {
    // await connection.rollbackTransaction();
  });
});
