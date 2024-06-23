import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: '運動をする',
    type: String,
    maxLength: 255,
    description: 'タイトル',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

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
}
