import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { User } from '../db/entities/user.entity';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../db/entities/task.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { TaskResponseDto, TaskResponseListDto } from './dto/task-response.dto';
import { FindAllTaskQueryDto } from './dto/findall-task-query';
import { FindTaskQueryDto } from './dto/find-task-query';

const mockUser1: User = {
  id: '1',
  username: 'hoge1',
  password: 'hoge',
  createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
  updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
  tasks: [],
};

const mockUser2: User = {
  id: '2',
  username: 'hoge1',
  password: 'hoge',
  createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
  updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<Task>>(
      getRepositoryToken(Task),
    ) as jest.Mocked<Repository<Task>>;
  });

  describe('findAll', () => {
    it('正常系', async () => {
      const tasks: Task[] = [];
      const expected: TaskResponseListDto = {
        tasks,
        total: 0,
      };
      const query: FindAllTaskQueryDto = { limit: 10 };
      jest.spyOn(taskRepository, 'find').mockImplementation(async () => tasks);
      const result = await tasksService.findAll(mockUser1, query);

      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    const query: FindTaskQueryDto = {};
    it('正常系', async () => {
      const expected: TaskResponseDto = {
        id: 'hoge',
        title: 'hogehoge',
        content: 'hoge',
        status: TaskStatus.NEW,
        createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
        updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
      };

      const task = new Task();
      task.id = 'hoge';
      task.title = 'hogehoge';
      task.content = 'hoge';
      task.status = TaskStatus.NEW;
      task.createdAt = new Date(2022, 5 - 1, 5, 6, 35, 20, 333);
      task.updatedAt = new Date(2022, 5 - 1, 5, 6, 35, 20, 333);

      jest
        .spyOn(taskRepository, 'findOne')
        .mockImplementation(async () => task);
      const result = await tasksService.findById('hoge', mockUser1, query);
      expect(result).toEqual(expected);
    });

    it('異常系: タスクが存在しない', async () => {
      jest
        .spyOn(taskRepository, 'findOne')
        .mockImplementation(async () => null);
      await expect(
        tasksService.findById('hoge', mockUser1, query),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('正常系', async () => {
      const expected: TaskResponseDto = {
        id: 'hoge',
        title: 'hogehoge',
        content: 'hoge',
        status: TaskStatus.NEW,
        createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
        updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
      };

      const task = new Task();
      task.id = 'hoge';
      task.title = 'hogehoge';
      task.content = 'hoge';
      task.status = TaskStatus.NEW;
      task.createdAt = new Date(2022, 5 - 1, 5, 6, 35, 20, 333);
      task.updatedAt = new Date(2022, 5 - 1, 5, 6, 35, 20, 333);

      jest.spyOn(taskRepository, 'create').mockImplementation(() => task);
      jest.spyOn(taskRepository, 'save').mockImplementation(async () => task);
      const result = await tasksService.create(
        {
          title: 'hogehoge',
          content: 'hoge',
        },
        mockUser1,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('updateStatus', () => {
    const task = new Task();
    task.id = 'hoge';
    task.title = 'hogehoge';
    task.content = 'hoge';
    task.status = TaskStatus.NEW;
    const updateResponse = new UpdateResult();
    updateResponse.affected = 1;

    it('正常系', async () => {
      jest
        .spyOn(taskRepository, 'findOneBy')
        .mockImplementation(async () => task);
      const spy = jest
        .spyOn(taskRepository, 'update')
        .mockImplementation(async () => updateResponse);
      await tasksService.updateStatus(
        {
          id: 'hoge',
          title: 'title',
          content: 'content',
          status: TaskStatus.DONE,
        },
        mockUser1,
      );
      expect(spy).toHaveBeenCalled();
    });

    it('異常系: 他者のタスクを変更またはタスクが存在しない', async () => {
      jest
        .spyOn(taskRepository, 'findOneBy')
        .mockImplementation(async () => null);
      await expect(
        tasksService.updateStatus(
          {
            id: 'hoge',
            title: 'title',
            content: 'content',
            status: TaskStatus.DONE,
          },
          mockUser2,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('異常系: タスクの更新に失敗', async () => {
      const tasks: Task[] = [];
      const task = tasks[0];
      const updateResponse = new UpdateResult();
      updateResponse.affected = 0;

      jest
        .spyOn(taskRepository, 'findOneBy')
        .mockImplementation(async () => task);
      jest
        .spyOn(taskRepository, 'update')
        .mockImplementation(async () => updateResponse);
      await expect(
        tasksService.updateStatus(
          {
            id: 'hoge',
            title: 'title',
            content: 'content',
            status: TaskStatus.DONE,
          },
          mockUser1,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    const task = new Task();
    task.id = 'hoge';
    task.title = 'hogehoge';
    task.content = 'hoge';
    task.status = TaskStatus.NEW;

    it('正常系', async () => {
      jest
        .spyOn(taskRepository, 'findOneBy')
        .mockImplementation(async () => task);

      const deleteResponse = new DeleteResult();
      deleteResponse.affected = 1;

      const spy = jest
        .spyOn(taskRepository, 'delete')
        .mockImplementation(async () => deleteResponse);
      await tasksService.delete('hoge', mockUser1);
      expect(spy).toHaveBeenCalled();
    });

    it('異常系: タスクの削除に失敗', async () => {
      jest
        .spyOn(taskRepository, 'findOneBy')
        .mockImplementation(async () => task);

      const deleteResponse = new DeleteResult();
      deleteResponse.affected = 0;

      jest
        .spyOn(taskRepository, 'delete')
        .mockImplementation(async () => deleteResponse);
      await expect(tasksService.delete('hoge', mockUser1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
