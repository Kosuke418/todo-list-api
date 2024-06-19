import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '../db/entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { Repository } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskResponseDto, TaskResponseListDto } from './dto/task-response.dto';
import { plainToInstance } from 'class-transformer';
import { FindAllTaskQueryDto } from './dto/findall-task-query';
import { FindTaskQueryDto } from './dto/find-task-query';
import { convertFieldsToSelect } from '../common/util/convert-fields-to-select';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}

  async findAll(
    userId: string,
    findAllTaskQueryDto: FindAllTaskQueryDto,
  ): Promise<TaskResponseListDto> {
    const { limit, offset, fields } = findAllTaskQueryDto;

    const tasks = await this.taskRepository.find({
      select: convertFieldsToSelect(fields),
      where: { userId },
      take: limit,
      skip: offset,
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
    userId: string,
    findTaskQueryDto: FindTaskQueryDto,
  ): Promise<TaskResponseDto> {
    const { fields } = findTaskQueryDto;

    const task = await this.taskRepository.findOne({
      select: convertFieldsToSelect(fields),
      where: { id, userId },
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
    userId: string,
  ): Promise<TaskResponseDto> {
    const { title, content } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      content,
      status: TaskStatus.NEW,
      userId,
    });

    await this.taskRepository.save(task);

    return plainToInstance(TaskResponseDto, task, {
      excludeExtraneousValues: true,
    });
  }

  async updateStatus(
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<TaskResponseDto> {
    // 更新後のタスクの状態をレスポンスで返すために一度取得
    const targetTask = await this.taskRepository.findOneBy({
      id: updateTaskDto.id,
      userId,
    });
    if (!targetTask) {
      throw new NotFoundException(
        `id:${updateTaskDto.id} は存在しないか、別のユーザのタスクです`,
      );
    }

    // undefinedの場合はレスポンスの内容を入れ替えずにおく
    targetTask.title =
      updateTaskDto.title !== undefined
        ? updateTaskDto.title
        : targetTask.title;
    targetTask.content =
      updateTaskDto.content !== undefined
        ? updateTaskDto.content
        : targetTask.content;
    targetTask.status =
      updateTaskDto.status !== undefined
        ? updateTaskDto.status
        : targetTask.status;

    const updatedResponse = await this.taskRepository.update(
      updateTaskDto.id,
      updateTaskDto,
    );
    if (updatedResponse.affected === 0) {
      throw new NotFoundException('タスクを更新できませんでした');
    }

    return plainToInstance(TaskResponseDto, targetTask, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const response = await this.taskRepository.delete({ id, userId });
    if (response.affected === 0) {
      throw new NotFoundException(`id:${id} のタスクを削除できませんでした`);
    }
  }
}
