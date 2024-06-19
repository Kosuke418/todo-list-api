import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AccessTokenDto {
  @ApiProperty({
    example: 'hoge',
    type: String,
  })
  @IsString()
  accessToken: string;
}
