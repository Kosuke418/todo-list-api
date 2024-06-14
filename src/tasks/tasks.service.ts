import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '../entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  async findById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne(id);
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto);
  }

  async updateStatus(updateTaskDtos: UpdateTaskDto[]): Promise<Task[]> {
    return await this.taskRepository.updateStatus(updateTaskDtos);
  }

  delete(id: string): void {
    this.taskRepository.delete(id);
  }
}
