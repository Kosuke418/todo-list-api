import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SuggestTaskDto {
  @ApiProperty({
    example: '世界一のプログラマになる',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  objective: string;
}
