import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { User } from 'src/entities/user.entity';
import { TaskStatus } from './task-status.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockTaskRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  updateStatus: jest.fn(),
  delete: jest.fn(),
});

const mockUser1: User = {
  id: '1',
  username: 'hoge1',
  password: 'hoge',
  createdAt: '2024-06-15T01:54:29.523Z',
  updatedAt: '2024-06-15T01:54:29.523Z',
  tasks: [],
};

const mockUser2: User = {
  id: '2',
  username: 'hoge1',
  password: 'hoge',
  createdAt: '2024-06-15T01:54:29.523Z',
  updatedAt: '2024-06-15T01:54:29.523Z',
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
          provide: TaskRepository,
          useFactory: mockTaskRepository,
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(
      TaskRepository,
    ) as jest.Mocked<TaskRepository>;
  });

  describe('findAll', () => {
    it('正常系', async () => {
      const expected = [];
      taskRepository.find.mockResolvedValue(expected);
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
      taskRepository.findOne.mockResolvedValue(expected);
      const result = await tasksService.findById('hoge', mockUser1);

      expect(result).toEqual(expected);
    });

    it('異常系', async () => {
      taskRepository.findOne.mockResolvedValue(null);
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
      taskRepository.createTask.mockResolvedValue(expected);
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
      taskRepository.findOne.mockResolvedValue(mockTask);
      await tasksService.updateStatus(
        [{ id: 'hoge', status: TaskStatus.COMPLETED }],
        mockUser2,
      );
      expect(taskRepository.updateStatus).toHaveBeenCalled();
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
      taskRepository.findOne.mockResolvedValue(mockTask);
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      await tasksService.delete('hoge', mockUser1);
      expect(taskRepository.delete).toHaveBeenCalled();
    });

    it('異常系', async () => {
      taskRepository.findOne.mockResolvedValue(mockTask);
      await expect(tasksService.delete('hoge', mockUser2)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('異常系2', async () => {
      taskRepository.findOne.mockResolvedValue(mockTask);
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(tasksService.delete('hoge', mockUser1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
