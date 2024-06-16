import { TaskStatus } from '../../tasks/task-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ comment: 'タスクテーブル' })
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
  @Column({ comment: 'タイトル' })
  title: string;

  @ApiProperty({
    example: '一時間以上の筋トレを行う',
    type: String,
    maxLength: 255,
  })
  @Column({ comment: '内容' })
  content: string;

  @ApiProperty({
    example: 'NEW',
    type: String,
  })
  @Column({ comment: 'ステータス' })
  status: TaskStatus;

  @ApiProperty({
    example: '2024-06-16T00:48:03.168Z',
    type: Date,
  })
  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
    comment: '作成日時',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-06-16T00:48:03.168Z',
    type: Date,
  })
  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    comment: '更新日時',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @ApiProperty({
    example: 'e6c015b3-cca1-4cca-970e-f0af96bf3727',
    type: String,
    maxLength: 255,
  })
  @Column({ comment: 'ユーザid' })
  userId: string;
}
