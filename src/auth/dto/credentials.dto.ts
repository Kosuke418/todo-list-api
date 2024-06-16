import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CredentialsDto {
  @ApiProperty({
    example: 'abc123',
    type: String,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  username: string;

  @ApiProperty({
    example: 'hogehoge',
    type: String,
    minLength: 8,
    maxLength: 255,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;
}
