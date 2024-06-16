import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AccessTokenDto {
  @ApiProperty({
    example: 'hoge',
    type: String,
  })
  @IsString()
  accessToken: string;
}
