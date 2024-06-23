import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SuggestTaskResponseDto {
  @ApiProperty({
    example: 'アルゴリズムの学習',
    type: String,
    maxLength: 255,
    description: 'タイトル',
  })
  @Expose()
  title: string;

  @ApiProperty({
    example: '基本から応用まで幅広く学習し、効率的なアルゴリズムを身につける',
    type: String,
    maxLength: 255,
    description: '内容',
  })
  @Expose()
  content: string;
}

export class SuggestTaskResponseListDto {
  @ApiProperty({ type: [SuggestTaskResponseDto] })
  tasks: SuggestTaskResponseDto[];

  @ApiProperty({
    example: '3',
    type: Number,
    description: 'tasksのlength',
  })
  total?: number;
}
