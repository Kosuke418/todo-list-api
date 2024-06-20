import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../db/entities/task.entity';
import { ExternalsModule } from '../externals/externals.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), ExternalsModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
