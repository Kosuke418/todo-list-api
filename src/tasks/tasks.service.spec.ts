import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { User } from '../db/entities/user.entity';
import { TaskStatus } from './task-status.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../db/entities/task.entity';
import { Repository } from 'typeorm';

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
  let taskRepository;

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
      const expected: Task[] = [];
      jest
        .spyOn(taskRepository, 'findBy')
        .mockImplementation(async () => expected);
      const result = await tasksService.findAll(mockUser1);

      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('正常系', async () => {
      const expected = {
        id: 'hoge',
        title: 'hogehoge',
        content: 'hoge',
        status: TaskStatus.NEW,
        createdAt: '',
        updatedAt: '',
        userId: mockUser1.id,
        user: mockUser1,
      };
      jest
        .spyOn(taskRepository, 'findOneBy')
        .mockImplementation(async () => expected);
      const result = await tasksService.findById('hoge', mockUser1);
      expect(result).toEqual(expected);
    });

    it('異常系: 商品が存在しない', async () => {
      jest
        .spyOn(taskRepository, 'findOneBy')
        .mockImplementation(async () => null);
      await expect(tasksService.findById('hoge', mockUser1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('正常系', async () => {
      const expected = {
        id: 'hoge',
        title: 'hogehoge',
        content: 'hoge',
        status: TaskStatus.NEW,
        createdAt: '',
        updatedAt: '',
        userId: mockUser1.id,
        user: mockUser1,
      };

      jest
        .spyOn(taskRepository, 'create')
        .mockImplementation(async () => expected);
      jest.spyOn(taskRepository, 'save').mockImplementation(async () => []);
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
    const mockTask = {
      id: 'hoge',
      title: 'hogehoge',
      content: 'hoge',
      status: TaskStatus.NEW,
      createdAt: '',
      updatedAt: '',
      userId: mockUser1.id,
      user: mockUser1,
    };
    it('正常系', async () => {
      jest
        .spyOn(taskRepository, 'findOneBy')
        .mockImplementation(async () => mockTask);
      const spy = jest
        .spyOn(taskRepository, 'save')
        .mockImplementation(() => mockTask);
      await tasksService.updateStatus(
        [{ id: 'hoge', status: TaskStatus.COMPLETED }],
        mockUser1,
      );
      expect(spy).toHaveBeenCalled();
    });

    it('異常系: 他者のtodoを変更', async () => {
      jest
        .spyOn(taskRepository, 'findOneBy')
        .mockImplementation(async () => {});
      await expect(
        tasksService.updateStatus(
          [{ id: 'hoge', status: TaskStatus.COMPLETED }],
          mockUser2,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('異常系: データの更新に失敗', async () => {
      jest
        .spyOn(taskRepository, 'findOneBy')
        .mockImplementation(async () => mockTask);
      jest.spyOn(taskRepository, 'save').mockImplementation(() => []);
      await expect(
        tasksService.updateStatus(
          [{ id: 'hoge', status: TaskStatus.COMPLETED }],
          mockUser1,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    const mockTask = {
      id: 'hoge',
      title: 'hogehoge',
      content: 'hoge',
      status: TaskStatus.NEW,
      createdAt: '',
      updatedAt: '',
      userId: mockUser1.id,
      user: mockUser1,
    };
    it('正常系', async () => {
      jest
        .spyOn(taskRepository, 'findOneBy')
        .mockImplementation(async () => mockTask);

      const deleteResponse = { affected: 1 };
      const spy = jest
        .spyOn(taskRepository, 'delete')
        .mockImplementation(async () => deleteResponse);
      await tasksService.delete('hoge', mockUser1);
      expect(spy).toHaveBeenCalled();
    });

    it('異常系: 他人のtodoを削除', async () => {
      jest
        .spyOn(taskRepository, 'findOneBy')
        .mockImplementation(async () => mockTask);
      await expect(tasksService.delete('hoge', mockUser2)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('異常系: todoが存在しない', async () => {
      jest
        .spyOn(taskRepository, 'findOneBy')
        .mockImplementation(async () => mockTask);

      const deleteResponse = { affected: 0 };
      jest
        .spyOn(taskRepository, 'delete')
        .mockImplementation(async () => deleteResponse);
      await expect(tasksService.delete('hoge', mockUser1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
