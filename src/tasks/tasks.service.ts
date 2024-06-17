import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '../db/entities/task.entity';
import { UpdateTaskListDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../db/entities/user.entity';
import { Repository } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskResponseDto } from './dto/task-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}

  async findAll(user: User): Promise<TaskResponseDto[]> {
    const task = await this.taskRepository.findBy({ userId: user.id });
    return plainToInstance(TaskResponseDto, task, {
      excludeExtraneousValues: true,
    });
  }

  async findById(id: string, user: User): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findOneBy({ id, userId: user.id });
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
    const { title, content } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      content,
      status: TaskStatus.NEW,
      user,
    });

    await this.taskRepository.save(task);

    return plainToInstance(TaskResponseDto, task, {
      excludeExtraneousValues: true,
    });
  }

  async updateStatus(
    updateTaskListDto: UpdateTaskListDto,
    user: User,
  ): Promise<TaskResponseDto[]> {
    let task: TaskResponseDto[] = [];
    for (let i: number = 0; i < updateTaskListDto.updateTasks.length; i++) {
      const updateTask = updateTaskListDto.updateTasks[i];
      const targetTask = await this.taskRepository.findOneBy({
        id: updateTask.id,
        userId: user.id,
      });
      if (!targetTask) {
        throw new NotFoundException(
          `id:${updateTask.id} は存在しないか、別のユーザのデータです`,
        );
      }

      // レスポンスとして更新後の内容を返したいので、undefinedの場合は内容を入れ替えずにおく
      targetTask.title =
        updateTask.title !== undefined ? updateTask.title : targetTask.title;
      targetTask.content =
        updateTask.content !== undefined
          ? updateTask.content
          : targetTask.content;
      targetTask.status =
        updateTask.status !== undefined ? updateTask.status : targetTask.status;

      task.push(targetTask);
    }
    const updatedTask = await this.taskRepository.save(task);
    if (updatedTask.length === 0) {
      throw new NotFoundException('データを更新できませんでした');
    }
    return task;
  }

  async delete(id: string, user: User): Promise<void> {
    const response = await this.taskRepository.delete({ id, userId: user.id });
    if (response.affected !== 1) {
      throw new NotFoundException(`${id}のデータを削除できませんでした`);
    }
  }
}
