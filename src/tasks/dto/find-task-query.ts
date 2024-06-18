import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsValidFields } from '../../common/decorator/valid-fields.decorator';
import { Task } from '../../db/entities/task.entity';

export class FindTaskQueryDto {
  @ApiProperty({
    example: 'title, status',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsValidFields(Task)
  @Type(() => String)
  fields?: string;
}
