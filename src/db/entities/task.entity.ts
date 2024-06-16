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

@Entity()
export class Task {
  @ApiProperty({
    example: 'e6c015b3-cca1-4cca-970e-f0af96bf3727',
    type: String,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: '運動をする',
    type: String,
    maxLength: 255,
  })
  @Column()
  title: string;

  @ApiProperty({
    example: '一時間以上の筋トレを行う',
    type: String,
    maxLength: 255,
  })
  @Column()
  content: string;

  @ApiProperty({
    example: 'NEW',
    type: String,
  })
  @Column()
  status: TaskStatus;

  @ApiProperty({
    example: '2024-06-16T00:48:03.168Z',
    type: Date,
  })
  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
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
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @ApiProperty({
    example: 'e6c015b3-cca1-4cca-970e-f0af96bf3727',
    type: String,
    maxLength: 255,
  })
  @Column()
  userId: string;
}
