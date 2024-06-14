import { Task } from 'src/entities/task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { UpdateTaskDto } from './dto/update-task.dto';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, content } = createTaskDto;
    const task = this.create({
      title,
      content,
      status: TaskStatus.NEW,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await this.save(task);

    return task;
  }

  async updateStatus(updateTaskDtos: UpdateTaskDto[]): Promise<Task[]> {
    let task: Task[] = [];
    for (let i: number = 0; i < updateTaskDtos.length; i++) {
      const targetTask = await this.findOne(updateTaskDtos[i].id);
      if (!targetTask) {
        throw new NotFoundException(`id:${updateTaskDtos[i].id} is Not Found`);
      }
      targetTask.status = updateTaskDtos[i].status;
      targetTask.updatedAt = new Date().toISOString();
      task.push(targetTask);
    }
    await this.save(task);

    return task;
  }
}
