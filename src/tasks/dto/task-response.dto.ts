import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../types/task-status.enum';
import { Expose } from 'class-transformer';

export class TaskResponseDto {
  @ApiProperty({
    example: 'e6c015b3-cca1-4cca-970e-f0af96bf3727',
    type: String,
    description: 'タスクid',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: '運動をする',
    type: String,
    maxLength: 255,
    description: 'タイトル',
  })
  @Expose()
  title: string;

  @ApiProperty({
    example: '一時間以上の筋トレを行う',
    type: String,
    maxLength: 255,
    required: false,
    description: '内容',
  })
  @Expose()
  content: string;

  @ApiProperty({
    example: '2024-06-17T19:00:38.022Z',
    type: Date,
    required: false,
    description: '期日',
  })
  @Expose()
  dueDate?: Date;

  @ApiProperty({
    example: '仕事',
    type: String,
    maxLength: 255,
    required: false,
    description: 'カテゴリ',
  })
  @Expose()
  category?: string;

  @ApiProperty({
    example: 'DONE',
    type: String,
    description: 'ステータス',
  })
  @Expose()
  status: TaskStatus;

  @ApiProperty({
    example: 'e6c015b3-cca1-4cca-970e-f0af96bf3727',
    type: String,
    maxLength: 255,
    description: 'ユーザid',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    example: '2024-06-17T19:00:38.022Z',
    type: Date,
    description: '作成日時',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: '2024-06-17T19:00:38.022Z',
    type: Date,
    description: '更新日時',
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
    description: 'tasksのlength',
  })
  total?: number;
}
