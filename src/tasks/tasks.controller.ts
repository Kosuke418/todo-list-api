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
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../authz/guards/jwt-auth.guard';
import { GetUser } from '../authz/decorator/get-user.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  BadRequestResponseDto,
  InternalServerErrorResponseDto,
  NotFoundResponseDto,
  UnauthorizedResponseDto,
} from '../common/dto/response.dto';
import { TaskResponseDto, TaskResponseListDto } from './dto/task-response.dto';
import { FindAllTaskQueryDto } from './dto/findall-task-query';
import { FindTaskQueryDto } from './dto/find-task-query';

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
    type: TaskResponseListDto,
  })
  @ApiBadRequestResponse({
    description: '入力値のフォーマットエラー',
    type: BadRequestResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '認証エラー',
    type: UnauthorizedResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'DBサーバ接続エラー',
    type: InternalServerErrorResponseDto,
  })
  @Get()
  async findAll(
    @GetUser() userId: string,
    @Query() findAllTaskQueryDto: FindAllTaskQueryDto,
  ): Promise<TaskResponseListDto> {
    return await this.tasksService.findAll(userId, findAllTaskQueryDto);
  }

  @ApiOperation({ summary: 'タスク詳細取得' })
  @ApiOkResponse({
    description: 'タスク詳細取得完了',
    type: TaskResponseDto,
  })
  @ApiBadRequestResponse({
    description: '入力値のフォーマットエラー',
    type: BadRequestResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '認証エラー',
    type: UnauthorizedResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'タスクが存在しないエラー',
    type: NotFoundResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'DBサーバ接続エラー',
    type: InternalServerErrorResponseDto,
  })
  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() userId: string,
    @Query() findTaskQueryDto: FindTaskQueryDto,
  ): Promise<TaskResponseDto> {
    return await this.tasksService.findById(id, userId, findTaskQueryDto);
  }

  @ApiOperation({ summary: 'タスク登録' })
  @ApiCreatedResponse({
    description: 'タスク登録完了',
    type: TaskResponseDto,
  })
  @ApiBadRequestResponse({
    description: '入力値のフォーマットエラー',
    type: BadRequestResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '認証エラー',
    type: UnauthorizedResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'DBサーバ接続エラー',
    type: InternalServerErrorResponseDto,
  })
  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() userId: string,
  ): Promise<TaskResponseDto> {
    return await this.tasksService.create(createTaskDto, userId);
  }

  @ApiOperation({
    summary: 'タスク更新',
  })
  @ApiBody({ type: UpdateTaskDto })
  @ApiOkResponse({
    description: 'タスク更新完了',
    type: TaskResponseDto,
  })
  @ApiBadRequestResponse({
    description: '入力値のフォーマットエラー',
    type: BadRequestResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '認証エラー',
    type: UnauthorizedResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'タスクが存在しないまたは別のユーザのタスクエラー',
    type: NotFoundResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'DBサーバ接続エラー',
    type: InternalServerErrorResponseDto,
  })
  @Patch()
  async updateStatus(
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() userId: string,
  ): Promise<TaskResponseDto> {
    return await this.tasksService.updateStatus(updateTaskDto, userId);
  }

  @ApiOperation({ summary: 'タスク削除' })
  @ApiOkResponse({
    description: 'タスク削除完了',
  })
  @ApiBadRequestResponse({
    description: '入力値のフォーマットエラー',
    type: BadRequestResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '認証エラー',
    type: UnauthorizedResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'タスクが存在しないまたは別のユーザのタスクエラー',
    type: NotFoundResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'DBサーバ接続エラー',
    type: InternalServerErrorResponseDto,
  })
  @Delete(':id')
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() userId: string,
  ): Promise<void> {
    await this.tasksService.delete(id, userId);
  }
}
