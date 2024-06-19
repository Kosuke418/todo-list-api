import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({
    example: 'abc123@example.com',
    type: String,
    maxLength: 255,
  })
  @Expose()
  email: string;
}
