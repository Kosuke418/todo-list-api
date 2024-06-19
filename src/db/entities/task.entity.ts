import { TaskStatus } from '../../tasks/task-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'tasks', comment: 'タスクテーブル' })
export class Task {
  @ApiProperty({
    example: 'e6c015b3-cca1-4cca-970e-f0af96bf3727',
    type: String,
  })
  @PrimaryGeneratedColumn('uuid', { comment: 'タスクid' })
  id: string;

  @ApiProperty({
    example: '運動をする',
    type: String,
    maxLength: 255,
  })
  @Column({ comment: 'タイトル', length: 255 })
  title: string;

  @ApiProperty({
    example: '一時間以上の筋トレを行う',
    type: String,
    maxLength: 255,
    nullable: true,
  })
  @Column({ comment: '内容', length: 255, nullable: true })
  content: string;

  @ApiProperty({
    example: 'NEW',
    type: String,
  })
  @Column({ comment: 'ステータス', length: 255 })
  status: TaskStatus;

  @ApiProperty({
    example: 'e6c015b3-cca1-4cca-970e-f0af96bf3727',
    type: String,
    maxLength: 255,
  })
  @Column({ name: 'user_id', comment: 'ユーザid', length: 255 })
  userId: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    default: () =>
      process.env.NODE_ENV === 'test'
        ? `strftime('%Y-%m-%d %H:%M:%S.%f', 'now')`
        : 'CURRENT_TIMESTAMP(6)',
    comment: '作成日時',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    default: () =>
      process.env.NODE_ENV === 'test'
        ? `strftime('%Y-%m-%d %H:%M:%S.%f', 'now')`
        : 'CURRENT_TIMESTAMP(6)',
    onUpdate:
      process.env.NODE_ENV === 'test'
        ? `strftime('%Y-%m-%d %H:%M:%S.%f', 'now')`
        : 'CURRENT_TIMESTAMP(6)',
    comment: '更新日時',
  })
  updatedAt: Date;
}
