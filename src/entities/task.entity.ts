import { TaskStatus } from 'src/tasks/task-status.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  status: TaskStatus;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;
}
