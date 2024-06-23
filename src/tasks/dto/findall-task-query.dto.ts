import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsValidFields } from '../../common/decorators/valid-fields.decorator';
import { Task } from '../../db/entities/task.entity';

export class FindAllTaskQueryDto {
  @ApiProperty({
    example: '20',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    example: '1',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number;

  @ApiProperty({
    example: 'title, status',
    type: String,
    required: false,
    description: '指定したfieldをレスポンスとして返却',
  })
  @IsOptional()
  @IsValidFields(Task)
  @Type(() => String)
  fields?: string;
}
