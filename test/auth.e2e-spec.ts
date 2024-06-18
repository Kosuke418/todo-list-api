import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { mockJwtService } from './mock/jwt.mock';
import { AuthService } from '../src/auth/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let authService: AuthService;

  const credential = {
    username: 'user123',
    password: 'hogehoge',
  };

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JwtService)
      .useValue(mockJwtService())
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    authService = moduleFixture.get<AuthService>(AuthService);
    await app.init();

    await authService.signUp(credential);
  });

  // ユーザ登録API
  describe('/signup (POST)', () => {
    it('正常系', async () => {
      return await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ username: 'abc123', password: 'hogehoge123' })
        .expect(201);
    });

    it('異常系：入力値のフォーマットエラー', async () => {
      return await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ username: 'abc123', password: 'hoge' })
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['password must be longer than or equal to 8 characters'],
          error: 'Bad Request',
        });
    });
  });

  // ユーザ認証API
  describe('/signin (POST)', () => {
    it('正常系', async () => {
      return await request(app.getHttpServer())
        .post('/auth/signin')
        .send(credential)
        .expect(201)
        .expect({ accessToken: 'mocked-jwt-token' });
    });

    it('異常系：入力値のフォーマットエラー', async () => {
      return await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ username: 'abc123', password: 'hoge' })
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['password must be longer than or equal to 8 characters'],
          error: 'Bad Request',
        });
    });

    it('異常系：認証エラー', async () => {
      return await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ username: credential.username, password: 'wrongpass' })
        .expect(401)
        .expect({
          statusCode: 401,
          message: `ユーザー名またはパスワードを確認してください`,
          error: 'Unauthorized',
        });
    });
  });

  afterAll(async () => {
    await app.close();
    await moduleFixture.close();
  });
});
