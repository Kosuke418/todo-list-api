import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CredentialsDto {
  @ApiProperty({
    example: '123@example.com',
    type: String,
    maxLength: 255,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

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
