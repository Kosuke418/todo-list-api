import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { IsUndefinedable } from '../../util/decorator/undefinedable.decorator';
import { TaskStatus } from '../task-status.enum';
import { Expose } from 'class-transformer';

export class TaskResponseDto {
  @ApiProperty({
    example: 'e6c015b3-cca1-4cca-970e-f0af96bf3727',
    type: String,
  })
  @IsUUID()
  @IsNotEmpty()
  @Expose()
  id: string;

  @ApiProperty({
    example: '運動をする',
    type: String,
    maxLength: 255,
    required: false,
  })
  @IsUndefinedable()
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @Expose()
  title: string;

  @ApiProperty({
    example: '一時間以上の筋トレを行う',
    type: String,
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Expose()
  content: string;

  @ApiProperty({
    example: 'DONE',
    type: String,
    required: false,
  })
  @IsUndefinedable()
  @IsEnum(TaskStatus)
  @Expose()
  status: TaskStatus;
}
