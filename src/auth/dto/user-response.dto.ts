import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UserResponseDto {
  @ApiProperty({
    example: 'abc123',
    type: String,
    maxLength: 255,
  })
  @Expose()
  username: string;
}
