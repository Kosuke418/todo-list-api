import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { MockJwtStrategy } from './mock/jwt.mock';
import { JwtStrategy } from '../src/auth/jwt.strategy';
import { Repository } from 'typeorm';
import { Task } from '../src/db/entities/task.entity';
import { TaskStatus } from '../src/tasks/task-status.enum';
import { TasksModule } from '../src/tasks/tasks.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/db/entities/user.entity';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let jwtService: JwtService;
  let userRepository: Repository<User>;
  let taskRepository: Repository<Task>;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule, TasksModule],
    })
      .overrideProvider(JwtStrategy)
      .useClass(MockJwtStrategy)
      .compile();

    // Nestアプリケーションの起動
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    jwtService = moduleFixture.get<JwtService>(JwtService);
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    taskRepository = moduleFixture.get<Repository<Task>>(
      getRepositoryToken(Task),
    );
    await app.init();

    await userRepository.save({
      id: '7d1d6cc5-f2f1-4993-b46f-7c33635783cd',
      username: 'user-1',
      password: 'hogehoge',
    });
    await taskRepository.save({
      title: '214',
      content: '',
      status: TaskStatus.NEW,
      userId: '7d1d6cc5-f2f1-4993-b46f-7c33635783cd',
      id: '7d1d6cc5-f2f1-4993-b46f-7c33235783cd',
    });
  });

  // ユーザー登録~更新のテストスイートを実行
  it('/tasks (GET)', async () => {
    const token = jwtService.sign(
      { id: 'hoge', username: 'hogehoge' },
      { secret: process.env.JWT_SECRET_KEY },
    );

    const response = await request(app.getHttpServer())
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  afterAll(async () => {
    // テスト後にトランザクションをロールバックし、接続を閉じる
    await app.close();
    await moduleFixture.close();
  });
});
