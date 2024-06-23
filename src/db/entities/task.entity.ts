import { TaskStatus } from '../../tasks/types/task-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'tasks', comment: 'タスクテーブル' })
export class Task {
  @PrimaryGeneratedColumn('uuid', { comment: 'タスクid' })
  id: string;

  @Column({ comment: 'タイトル', length: 255 })
  title: string;

  @Column({ comment: '内容', length: 255, nullable: true })
  content: string;

  @Column({ comment: 'ステータス', length: 255 })
  status: TaskStatus;

  @Column({ name: 'due_date', comment: '期日', nullable: true })
  dueDate: Date;

  @Column({ comment: 'カテゴリ', nullable: true })
  category: string;

  @ManyToOne(() => User, (user) => user.tasks, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

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
