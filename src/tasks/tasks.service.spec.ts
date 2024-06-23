import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { User } from '../db/entities/user.entity';
import { TaskStatus } from './types/task-status.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../db/entities/task.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { TaskResponseDto, TaskResponseListDto } from './dto/task-response.dto';
import { FindAllTaskQueryDto } from './dto/findall-task-query.dto';
import { FindTaskQueryDto } from './dto/find-task-query.dto';
import { ChatGPTService } from '../externals/chatgpt.service';
import { ConfigService } from '@nestjs/config';
import {
  SuggestTaskResponseDto,
  SuggestTaskResponseListDto,
} from './dto/suggest-task-response.dto';

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
  let chatGPTService: ChatGPTService;
  let taskRepository: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
        ChatGPTService,
        ConfigService,
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    chatGPTService = module.get<ChatGPTService>(ChatGPTService);
    taskRepository = module.get<Repository<Task>>(
      getRepositoryToken(Task),
    ) as jest.Mocked<Repository<Task>>;
  });

  describe('findAll', () => {
    it('正常系', async () => {
      const tasks: Task[] = [
        {
          title: 'user-1-title-1',
          content: 'content-1',
          status: TaskStatus.NEW,
          userId: mockUser1.id,
          id: 'e6c015b3-cca1-4cca-970e-f0af96bf3727',
          createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
          updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
          category: 'category-1',
          dueDate: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
          user: mockUser1,
        },
      ];
      const expected: TaskResponseListDto = {
        tasks: [
          {
            title: 'user-1-title-1',
            content: 'content-1',
            status: TaskStatus.NEW,
            userId: mockUser1.id,
            id: 'e6c015b3-cca1-4cca-970e-f0af96bf3727',
            createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
            updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
            category: 'category-1',
            dueDate: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
          },
        ],
        total: 1,
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
        userId: mockUser1.id,
        status: TaskStatus.NEW,
        category: 'category-1',
        dueDate: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
        createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
        updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
      };

      const task: Task = {
        id: 'hoge',
        title: 'hogehoge',
        content: 'hoge',
        userId: mockUser1.id,
        user: mockUser1,
        status: TaskStatus.NEW,
        category: 'category-1',
        dueDate: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
        createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
        updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
      };

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
        userId: mockUser1.id,
        status: TaskStatus.NEW,
        category: 'category-1',
        dueDate: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
        createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
        updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
      };

      const task: Task = {
        id: 'hoge',
        title: 'hogehoge',
        content: 'hoge',
        userId: mockUser1.id,
        user: mockUser1,
        status: TaskStatus.NEW,
        category: 'category-1',
        dueDate: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
        createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
        updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
      };

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
    const task: Task = {
      id: 'hoge',
      title: 'hogehoge',
      content: 'hoge',
      userId: mockUser1.id,
      user: mockUser1,
      status: TaskStatus.NEW,
      category: 'category-1',
      dueDate: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
      createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
      updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
    };

    const updateResponse = new UpdateResult();
    updateResponse.affected = 1;

    it('正常系', async () => {
      const updatedTask: Task = {
        id: 'hoge',
        title: 'title',
        content: 'content',
        status: TaskStatus.DONE,
        userId: mockUser1.id,
        user: mockUser1,
        category: 'category-1',
        dueDate: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
        createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
        updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
      };
      const expected: TaskResponseDto = {
        id: 'hoge',
        title: 'title',
        content: 'content',
        status: TaskStatus.DONE,
        userId: mockUser1.id,
        category: 'category-1',
        dueDate: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
        createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
        updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
      };
      jest
        .spyOn(taskRepository, 'findOneBy')
        .mockImplementation(async () => task);
      jest
        .spyOn(taskRepository, 'update')
        .mockImplementation(async () => updateResponse);
      jest
        .spyOn(taskRepository, 'findOneBy')
        .mockImplementation(async () => updatedTask);
      const result = await tasksService.updateStatus(
        {
          id: 'hoge',
          title: 'title',
          content: 'content',
          status: TaskStatus.DONE,
        },
        mockUser1,
      );
      expect(result).toEqual(expected);
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
    const task: Task = {
      id: 'hoge',
      title: 'hogehoge',
      content: 'hoge',
      userId: mockUser1.id,
      user: mockUser1,
      status: TaskStatus.NEW,
      category: 'category-1',
      dueDate: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
      createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
      updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
    };

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

  describe('suggest', () => {
    it('正常系', async () => {
      const suggetResponses: SuggestTaskResponseDto[] = [
        {
          title: 'title1',
          content: 'content1',
        },
        {
          title: 'title2',
          content: 'content2',
        },
        {
          title: 'title3',
          content: 'content3',
        },
      ];
      const expected: SuggestTaskResponseListDto = {
        tasks: suggetResponses,
        total: 3,
      };

      jest.spyOn(taskRepository, 'find').mockImplementation(async () => []);
      jest
        .spyOn(chatGPTService, 'generateResponse')
        .mockImplementation(async () => JSON.stringify(suggetResponses));
      const result = await tasksService.suggest('hoge', mockUser1);

      expect(result).toEqual(expected);
    });

    it('異常系: 接続の失敗', async () => {
      jest.spyOn(taskRepository, 'find').mockImplementation(async () => []);
      jest
        .spyOn(chatGPTService, 'generateResponse')
        .mockImplementation(async () => {
          throw new BadRequestException('生成に失敗しました');
        });
      await expect(tasksService.suggest('hoge', mockUser1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
