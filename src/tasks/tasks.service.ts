import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task } from '../entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskRepository } from './task.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async findAll(user: User): Promise<Task[]> {
    return await this.taskRepository.find({ user });
  }

  async findById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({ id, user });
    if (!task) {
      throw new NotFoundException('商品が存在しません');
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto, user);
  }

  async updateStatus(
    updateTaskDtos: UpdateTaskDto[],
    user: User,
  ): Promise<Task[]> {
    return await this.taskRepository.updateStatus(updateTaskDtos, user);
  }

  async delete(id: string, user: User): Promise<void> {
    const task = await this.taskRepository.findOne({ id });
    if (task.userId !== user.id) {
      throw new BadRequestException('他人の商品を削除することはできません');
    }
    const response = await this.taskRepository.delete({ id, user });
    if (response.affected !== 1) {
      throw new NotFoundException(`${id}のデータを削除できませんでした`);
    }
  }
}
