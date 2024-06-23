import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../types/task-status.enum';
import { Expose } from 'class-transformer';

export class TaskResponseDto {
  @ApiProperty({
    example: 'e6c015b3-cca1-4cca-970e-f0af96bf3727',
    type: String,
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: '運動をする',
    type: String,
    maxLength: 255,
  })
  @Expose()
  title: string;

  @ApiProperty({
    example: '一時間以上の筋トレを行う',
    type: String,
    maxLength: 255,
    required: false,
  })
  @Expose()
  content: string;

  @ApiProperty({
    example: '2024-06-17T19:00:38.022Z',
    type: Date,
    required: false,
  })
  @Expose()
  dueDate?: Date;

  @ApiProperty({
    example: '仕事',
    type: String,
    maxLength: 255,
    required: false,
  })
  @Expose()
  category?: string;

  @ApiProperty({
    example: 'DONE',
    type: String,
  })
  @Expose()
  status: TaskStatus;

  @ApiProperty({
    example: 'e6c015b3-cca1-4cca-970e-f0af96bf3727',
    type: String,
    maxLength: 255,
  })
  @Expose()
  userId: string;

  @ApiProperty({
    example: '2024-06-17T19:00:38.022Z',
    type: Date,
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: '2024-06-17T19:00:38.022Z',
    type: Date,
  })
  @Expose()
  updatedAt: Date;
}

export class TaskResponseListDto {
  @ApiProperty({ type: [TaskResponseDto] })
  tasks: TaskResponseDto[];

  @ApiProperty({
    example: '20',
    type: Number,
  })
  total?: number;
}
