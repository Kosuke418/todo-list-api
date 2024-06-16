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

@Entity({ comment: 'ユーザーテーブル' })
export class User {
  @PrimaryGeneratedColumn('uuid', { comment: 'ユーザid' })
  id: string;

  @Column({ unique: true, comment: 'ユーザ名' })
  username: string;

  @Column({ comment: 'パスワード' })
  @Exclude({ toPlainOnly: true })
  password: string;

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
    comment: '作成日時',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    comment: '更新日時',
  })
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
