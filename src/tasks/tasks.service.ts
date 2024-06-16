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
import { TaskStatus } from './task-status.enum';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}

  async findAll(user: User): Promise<Task[]> {
    return await this.taskRepository.findBy({ userId: user.id });
  }

  async findById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id, userId: user.id });
    if (!task) {
      throw new NotFoundException('todoが存在しません');
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, content } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      content,
      status: TaskStatus.NEW,
      user,
    });

    await this.taskRepository.save(task);

    return task;
  }

  async updateStatus(
    updateTaskDtos: UpdateTaskDto[],
    user: User,
  ): Promise<Task[]> {
    let task: Task[] = [];
    for (let i: number = 0; i < updateTaskDtos.length; i++) {
      const targetTask = await this.taskRepository.findOneBy({
        id: updateTaskDtos[i].id,
        userId: user.id,
      });
      if (!targetTask) {
        throw new NotFoundException(
          `id:${updateTaskDtos[i].id} は存在しないか、別のユーザのデータです`,
        );
      }
      targetTask.status = updateTaskDtos[i].status;
      task.push(targetTask);
    }
    const updatedTask = await this.taskRepository.save(task);
    if (updatedTask.length === 0) {
      throw new NotFoundException('データを更新できませんでした');
    }
    return task;
  }

  async delete(id: string, user: User): Promise<void> {
    const task = await this.taskRepository.findOneBy({ id });
    if (task.userId !== user.id) {
      throw new BadRequestException('他人のtodoを削除することはできません');
    }
    const response = await this.taskRepository.delete({ id, userId: user.id });
    if (response.affected !== 1) {
      throw new NotFoundException(`${id}のデータを削除できませんでした`);
    }
  }
}
