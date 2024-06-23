import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task } from '../db/entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../db/entities/user.entity';
import { Repository } from 'typeorm';
import { TaskStatus } from './types/task-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskResponseDto, TaskResponseListDto } from './dto/task-response.dto';
import { plainToInstance } from 'class-transformer';
import { FindAllTaskQueryDto } from './dto/findall-task-query.dto';
import { FindTaskQueryDto } from './dto/find-task-query.dto';
import { convertFieldsToSelect } from '../common/utils/convert-fields-to-select';
import { ChatGPTService } from '../externals/chatgpt.service';
import { ChatMessage } from '../externals/types/chat-message.interface';
import {
  SuggestTaskResponseDto,
  SuggestTaskResponseListDto,
} from './dto/suggest-task-response.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    private readonly chatGPTService: ChatGPTService,
  ) {}

  async findAll(
    user: User,
    findAllTaskQueryDto: FindAllTaskQueryDto,
  ): Promise<TaskResponseListDto> {
    const { limit, offset, fields } = findAllTaskQueryDto;

    const tasks = await this.taskRepository.find({
      select: convertFieldsToSelect(fields),
      where: { userId: user.id },
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    const taskResponseDto = plainToInstance(TaskResponseDto, tasks, {
      excludeExtraneousValues: true,
    });
    const response: TaskResponseListDto = {
      tasks: taskResponseDto,
      total: taskResponseDto.length,
    };

    return response;
  }

  async findById(
    id: string,
    user: User,
    findTaskQueryDto: FindTaskQueryDto,
  ): Promise<TaskResponseDto> {
    const { fields } = findTaskQueryDto;

    const task = await this.taskRepository.findOne({
      select: convertFieldsToSelect(fields),
      where: { id, userId: user.id },
    });
    if (!task) {
      throw new NotFoundException('タスクが存在しません');
    }
    return plainToInstance(TaskResponseDto, task, {
      excludeExtraneousValues: true,
    });
  }

  async create(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<TaskResponseDto> {
    const createTask = { ...createTaskDto, status: TaskStatus.NEW, user };
    const task = this.taskRepository.create(createTask);

    await this.taskRepository.save(task);

    return plainToInstance(TaskResponseDto, task, {
      excludeExtraneousValues: true,
    });
  }

  async updateStatus(
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<TaskResponseDto> {
    const targetTask = await this.taskRepository.findOneBy({
      id: updateTaskDto.id,
      userId: user.id,
    });
    if (!targetTask) {
      throw new NotFoundException(
        `id:${updateTaskDto.id} は存在しないか、別のユーザのタスクです`,
      );
    }

    const updatedResponse = await this.taskRepository.update(
      updateTaskDto.id,
      updateTaskDto,
    );
    if (updatedResponse.affected === 0) {
      throw new NotFoundException('タスクを更新できませんでした');
    }

    const updatedTask = await this.taskRepository.findOneBy({
      id: updateTaskDto.id,
      userId: user.id,
    });

    return plainToInstance(TaskResponseDto, updatedTask, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: string, user: User): Promise<void> {
    const response = await this.taskRepository.delete({ id, userId: user.id });
    if (response.affected === 0) {
      throw new NotFoundException(`id:${id} のタスクを削除できませんでした`);
    }
  }

  async suggest(
    objective: string,
    user: User,
  ): Promise<SuggestTaskResponseListDto> {
    const OUTPUT_NUM = 3;
    const REFERENCE_NUM = 5;
    const referenceTasks = await this.taskRepository.find({
      select: ['title', 'content'],
      where: { userId: user.id },
      take: REFERENCE_NUM,
    });

    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: `
        -----
        ${referenceTasks}
        -----
        上記のTODOを参考かつ、被らないように
        以下の目標を基にやるべきtodoを${OUTPUT_NUM}個、JSONで出力。
        「${objective}」

        title:todoの概要(255文字以下)
        content:todoの詳細(255文字以下)

        #出力形式（言語：日本語）
        [
          {
            "title":<title1>,
            "content":<content1>
          },
          {
            "title":<title2>,
            "content":<content2>
          },
          {
            "title":<title3>,
            "content":<content3>
          }
        ]

        #出力
        `,
      },
    ];

    let response: SuggestTaskResponseListDto;
    try {
      const tasks: SuggestTaskResponseDto[] = JSON.parse(
        await this.chatGPTService.generateResponse(messages),
      );
      response = { tasks, total: tasks.length };
    } catch {
      throw new BadRequestException('目標の生成に失敗しました');
    }

    return response;
  }
}
