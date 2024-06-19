import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../db/entities/task.entity';
import { AuthzModule } from '../authz/authz.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuthzModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
