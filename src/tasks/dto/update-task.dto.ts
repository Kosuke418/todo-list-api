import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class UpdateTaskDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;
}
