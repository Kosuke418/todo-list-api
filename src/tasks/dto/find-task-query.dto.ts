import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsValidFields } from '../../common/decorators/valid-fields.decorator';
import { Task } from '../../db/entities/task.entity';

export class FindTaskQueryDto {
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
