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
    required: false,
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
    example: 'DONE',
    type: String,
    required: false,
  })
  @Expose()
  status: TaskStatus;

  @ApiProperty({
    example: '2024-06-17T19:00:38.022Z',
    type: Date,
    required: false,
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: '2024-06-17T19:00:38.022Z',
    type: Date,
    required: false,
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
