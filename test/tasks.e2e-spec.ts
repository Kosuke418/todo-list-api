import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Task } from '../src/db/entities/task.entity';
import { TaskStatus } from '../src/tasks/types/task-status.enum';
import { TasksModule } from '../src/tasks/tasks.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/db/entities/user.entity';
import { CreateTaskDto } from '../src/tasks/dto/create-task.dto';
import { UpdateTaskDto } from '../src/tasks/dto/update-task.dto';
import { AuthModule } from '../src/auth/auth.module';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let jwtService: JwtService;
  let userRepository: Repository<User>;
  let taskRepository: Repository<Task>;

  const mockUser1 = {
    id: '7d1d6cc5-f2f1-4993-b46f-7c33635783cd',
    username: 'user-1',
    password: 'hogehoge',
  };
  const mockUser2 = {
    id: '3a0ac1d7-0328-9dbd-b2d5-16724a5385b5',
    username: 'user-2',
    password: 'hogehoge',
  };
  const mockUser3 = {
    id: '2d9d1a6a-e144-026a-0bcd-b0c776e1dd6a',
    username: 'user-3',
    password: 'hogehoge',
  };
  const mockUser4 = {
    id: '8b134312-b411-446b-21fa-41c990d07b94',
    username: 'user-4',
    password: 'hogehoge',
  };
  const mockUser5 = {
    id: '2c03ca58-da6b-0d1c-a333-5a28a0517378',
    username: 'user-5',
    password: 'hogehoge',
  };

  const mockTask1 = {
    title: 'user-1-title-1',
    content: 'content-1',
    status: TaskStatus.NEW,
    userId: mockUser1.id,
    id: 'e6c015b3-cca1-4cca-970e-f0af96bf3727',
    createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
    updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
  };
  const mockTask2 = {
    title: 'user-1-title-2',
    content: 'content-2',
    status: TaskStatus.NEW,
    userId: mockUser1.id,
    id: '7376a2cf-d6a8-7414-b40d-b0d7af888f54',
    createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
    updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
  };
  const mockTask3 = {
    title: 'user-2-title-3',
    content: 'content-3',
    status: TaskStatus.NEW,
    userId: mockUser2.id,
    id: 'b3947e05-98e9-bddf-ec5d-da7417e907fa',
    createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
    updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
  };
  const mockTask4 = {
    title: 'user-4-title-4',
    content: 'content-4',
    status: TaskStatus.NEW,
    userId: mockUser5.id,
    id: 'c588b1fd-d7d2-c178-41c1-97c27986ea04',
    createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
    updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
  };
  const mockTask5 = {
    title: 'user-4-title-5',
    content: 'content-5',
    status: TaskStatus.NEW,
    userId: mockUser5.id,
    id: '28e7b60b-4dbf-c411-5726-280cde58f94f',
    createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
    updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
  };
  const mockTask6 = {
    title: 'user-1-title-6',
    content: 'content-6',
    status: TaskStatus.NEW,
    userId: mockUser1.id,
    id: '3fe45d78-2987-2ab0-944f-9b68d8a4e4d7',
    createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
    updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
  };

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule, TasksModule, AuthModule],
    }).compile();

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

    await userRepository.save([
      mockUser1,
      mockUser2,
      mockUser3,
      mockUser4,
      mockUser5,
    ]);
    await taskRepository.save([
      mockTask1,
      mockTask2,
      mockTask3,
      mockTask4,
      mockTask5,
      mockTask6,
    ]);
  });

  // タスク一覧取得API
  describe('/tasks (GET)', () => {
    it('正常系：タスクが存在する', async () => {
      const token = jwtService.sign(
        { id: mockUser1.id, username: mockUser1.username },
        { secret: process.env.JWT_SECRET_KEY },
      );

      const response = await request(app.getHttpServer())
        .get('/tasks?limit=2&fields=title,content,status')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const expected = {
        tasks: [
          {
            title: mockTask1.title,
            content: mockTask1.content,
            status: mockTask1.status,
          },
          {
            title: mockTask2.title,
            content: mockTask2.content,
            status: mockTask2.status,
          },
        ],
        total: 2,
      };

      expect(response.body).toEqual(expected);
    });

    it('正常系：タスクが存在しない', async () => {
      const token = jwtService.sign(
        { id: mockUser3.id, username: mockUser3.username },
        { secret: process.env.JWT_SECRET_KEY },
      );

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const expected = { tasks: [], total: 0 };

      expect(response.body).toEqual(expected);
    });

    it('異常系：入力値のフォーマットエラー', async () => {
      const token = jwtService.sign(
        { id: mockUser1.id, username: mockUser1.username },
        { secret: process.env.JWT_SECRET_KEY },
      );

      await request(app.getHttpServer())
        .get('/tasks?limit=2&fields=hoge')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'fieldsの指定が正しくありません。許可されているfields: id, title, content, status, userId, createdAt, updatedAt',
          ],
          error: 'Bad Request',
        });
    });
  });

  // タスク詳細取得API
  describe('/tasks/:id (GET)', () => {
    it('正常系', async () => {
      const token = jwtService.sign(
        { id: mockUser1.id, username: mockUser1.username },
        { secret: process.env.JWT_SECRET_KEY },
      );

      const response = await request(app.getHttpServer())
        .get(`/tasks/${mockTask1.id}?fields=title,content,status`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const expected = {
        title: mockTask1.title,
        content: mockTask1.content,
        status: mockTask1.status,
      };

      expect(response.body).toEqual(expected);
    });

    it('異常系：入力値のフォーマットエラー', async () => {
      const token = jwtService.sign(
        { id: mockUser1.id, username: mockUser1.username },
        { secret: process.env.JWT_SECRET_KEY },
      );

      await request(app.getHttpServer())
        .get(`/tasks/123`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'Validation failed (uuid is expected)',
          error: 'Bad Request',
        });
    });

    it('異常系：タスクが存在しない', async () => {
      const token = jwtService.sign(
        { id: mockUser3.id, username: mockUser3.username },
        { secret: process.env.JWT_SECRET_KEY },
      );

      await request(app.getHttpServer())
        .get(`/tasks/${mockTask1.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect({
          statusCode: 404,
          message: 'タスクが存在しません',
          error: 'Not Found',
        });
    });
  });

  // タスク登録API
  describe('/tasks (POST)', () => {
    it('正常系', async () => {
      const createTask: CreateTaskDto = {
        title: 'user-2-title-3',
        content: 'content-3',
      };
      const token = jwtService.sign(
        { id: mockUser4.id, username: mockUser4.username },
        { secret: process.env.JWT_SECRET_KEY },
      );

      const expected = {
        title: createTask.title,
        content: createTask.content,
        status: TaskStatus.NEW,
      };

      await request(app.getHttpServer())
        .post(`/tasks`)
        .set('Authorization', `Bearer ${token}`)
        .send(createTask)
        .expect(201)
        .expect((res) => {
          const responseBody = { ...res.body };
          // UUIDをテストから省く
          delete responseBody.id;
          delete responseBody.createdAt;
          delete responseBody.updatedAt;

          expect(responseBody).toEqual(expected);
        });
    });

    it('異常系：入力値のフォーマットエラー', async () => {
      const createTask: CreateTaskDto = {
        title: '',
        content: 'content-3',
      };
      const token = jwtService.sign(
        { id: mockUser4.id, username: mockUser4.username },
        { secret: process.env.JWT_SECRET_KEY },
      );

      await request(app.getHttpServer())
        .post(`/tasks`)
        .set('Authorization', `Bearer ${token}`)
        .send(createTask)
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['title should not be empty'],
          error: 'Bad Request',
        });
    });
  });

  // タスク更新API
  describe('/tasks (PATCH)', () => {
    it('正常系', async () => {
      const updateTask: UpdateTaskDto = {
        id: mockTask4.id,
        content: 'test',
      };
      const token = jwtService.sign(
        { id: mockUser5.id, username: mockUser5.username },
        { secret: process.env.JWT_SECRET_KEY },
      );

      const expected = {
        title: mockTask4.title,
        content: 'test',
        status: TaskStatus.NEW,
        createdAt: mockTask1.createdAt.toISOString(),
        updatedAt: mockTask1.updatedAt.toISOString(),
      };

      await request(app.getHttpServer())
        .patch(`/tasks`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateTask)
        .expect(200)
        .expect((res) => {
          const responseBody = { ...res.body };
          // UUIDをテストから省く
          delete responseBody.id;

          expect(responseBody).toEqual(expected);
        });
    });

    it('異常系：入力値のフォーマットエラー', async () => {
      const updateTask: UpdateTaskDto = {
        id: mockTask4.id,
        title: null,
        content: 'test',
      };
      const token = jwtService.sign(
        { id: mockUser4.id, username: mockUser4.username },
        { secret: process.env.JWT_SECRET_KEY },
      );

      await request(app.getHttpServer())
        .patch(`/tasks`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateTask)
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'title must be shorter than or equal to 255 characters',
            'title must be a string',
            'title should not be empty',
          ],
          error: 'Bad Request',
        });
    });

    it('異常系：タスクが存在しない', async () => {
      const updateTask: UpdateTaskDto = {
        id: '9cc87789-1cc0-7197-52c2-9a8d9d00fb3e',
        content: 'test',
      };
      const token = jwtService.sign(
        { id: mockUser4.id, username: mockUser4.username },
        { secret: process.env.JWT_SECRET_KEY },
      );

      await request(app.getHttpServer())
        .patch(`/tasks`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateTask)
        .expect(404)
        .expect({
          statusCode: 404,
          message: `id:${updateTask.id} は存在しないか、別のユーザのタスクです`,
          error: 'Not Found',
        });
    });

    it('異常系：別のユーザのタスク', async () => {
      const updateTask: UpdateTaskDto = {
        id: mockTask1.id,
        content: 'test',
      };
      const token = jwtService.sign(
        { id: mockUser4.id, username: mockUser4.username },
        { secret: process.env.JWT_SECRET_KEY },
      );

      await request(app.getHttpServer())
        .patch(`/tasks`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateTask)
        .expect(404)
        .expect({
          statusCode: 404,
          message: `id:${updateTask.id} は存在しないか、別のユーザのタスクです`,
          error: 'Not Found',
        });
    });
  });

  // タスク削除API
  describe('/tasks/:id (DELETE)', () => {
    it('正常系', async () => {
      const token = jwtService.sign(
        { id: mockUser2.id, username: mockUser2.username },
        { secret: process.env.JWT_SECRET_KEY },
      );

      await request(app.getHttpServer())
        .delete(`/tasks/${mockTask3.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('異常系：入力値のフォーマットエラー', async () => {
      const token = jwtService.sign(
        { id: mockUser2.id, username: mockUser2.username },
        { secret: process.env.JWT_SECRET_KEY },
      );

      await request(app.getHttpServer())
        .delete(`/tasks/hoge`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'Validation failed (uuid is expected)',
          error: 'Bad Request',
        });
    });

    it('異常系：タスクが存在しない', async () => {
      const token = jwtService.sign(
        { id: mockUser2.id, username: mockUser2.username },
        { secret: process.env.JWT_SECRET_KEY },
      );

      await request(app.getHttpServer())
        .delete(`/tasks/094a50b5-70d9-f16d-5d1c-7243dc293a9b`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect({
          statusCode: 404,
          message: `id:094a50b5-70d9-f16d-5d1c-7243dc293a9b のタスクを削除できませんでした`,
          error: 'Not Found',
        });
    });

    it('異常系：別のユーザのタスク', async () => {
      const token = jwtService.sign(
        { id: mockUser4.id, username: mockUser4.username },
        { secret: process.env.JWT_SECRET_KEY },
      );

      await request(app.getHttpServer())
        .delete(`/tasks/${mockTask1.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect({
          statusCode: 404,
          message: `id:${mockTask1.id} のタスクを削除できませんでした`,
          error: 'Not Found',
        });
    });
  });

  afterAll(async () => {
    await app.close();
    await moduleFixture.close();
  });
});
