import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SuggestTaskDto {
  @ApiProperty({
    example: '世界一のプログラマになる',
    type: String,
    description: '目標',
  })
  @IsNotEmpty()
  @IsString()
  objective: string;
}
