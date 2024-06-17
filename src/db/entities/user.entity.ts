import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users', comment: 'ユーザーテーブル' })
export class User {
  @PrimaryGeneratedColumn('uuid', { comment: 'ユーザid' })
  id: string;

  @Column({ unique: true, comment: 'ユーザ名', length: 255 })
  username: string;

  @Column({ comment: 'パスワード', length: 255 })
  @Exclude({ toPlainOnly: true })
  password: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

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
