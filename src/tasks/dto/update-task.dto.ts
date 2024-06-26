import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { TaskStatus } from '../types/task-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsUndefinedable } from '../../common/decorators/undefinedable.decorator';
import { Type } from 'class-transformer';

export class UpdateTaskDto {
  @ApiProperty({
    example: 'e6c015b3-cca1-4cca-970e-f0af96bf3727',
    type: String,
    description: 'タスクid',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: '運動をする',
    type: String,
    maxLength: 255,
    required: false,
    description: 'タイトル',
  })
  @IsUndefinedable()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiProperty({
    example: '一時間以上の筋トレを行う',
    type: String,
    maxLength: 255,
    required: false,
    description: '内容',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  content?: string;

  @ApiProperty({
    example: '2024-06-17T19:00:38.022Z',
    type: Date,
    required: false,
    description: '期日',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;

  @ApiProperty({
    example: '仕事',
    type: String,
    maxLength: 255,
    required: false,
    description: 'カテゴリ',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  category?: string;

  @ApiProperty({
    example: 'DONE',
    type: String,
    required: false,
    description: 'ステータス',
  })
  @IsUndefinedable()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
