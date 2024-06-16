import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '../db/entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '../db/entities/user.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @ApiOperation({ summary: 'タスク一覧取得' })
  @ApiOkResponse({
    description: 'タスク一覧取得完了',
    type: [Task],
  })
  @ApiInternalServerErrorResponse({
    description: 'DBサーバ接続エラー',
  })
  @Get()
  async findAll(@GetUser() user: User): Promise<Task[]> {
    return await this.tasksService.findAll(user);
  }

  @ApiOperation({ summary: 'タスク詳細取得' })
  @ApiOkResponse({
    description: 'タスク詳細取得完了',
    type: Task,
  })
  @ApiInternalServerErrorResponse({
    description: 'DBサーバ接続エラー',
  })
  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.tasksService.findById(id, user);
  }

  @ApiOperation({ summary: 'タスク登録' })
  @ApiCreatedResponse({
    description: 'タスク登録完了',
    type: Task,
  })
  @ApiInternalServerErrorResponse({
    description: 'DBサーバ接続エラー',
  })
  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.tasksService.create(createTaskDto, user);
  }

  @ApiOperation({
    summary: 'タスク更新',
  })
  @ApiBody({ type: [UpdateTaskDto] })
  @ApiOkResponse({
    description: 'タスク更新完了',
    type: [Task],
  })
  @ApiInternalServerErrorResponse({
    description: 'DBサーバ接続エラー',
  })
  @Patch()
  async updateStatus(
    @Body() updateTaskDtos: UpdateTaskDto[],
    @GetUser() user: User,
  ): Promise<Task[]> {
    return await this.tasksService.updateStatus(updateTaskDtos, user);
  }

  @ApiOperation({ summary: 'タスク削除' })
  @ApiOkResponse({
    description: 'タスク削除完了',
  })
  @ApiInternalServerErrorResponse({
    description: 'DBサーバ接続エラー',
  })
  @Delete(':id')
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ): Promise<void> {
    await this.tasksService.delete(id, user);
  }
}
