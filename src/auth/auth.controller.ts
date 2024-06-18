import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CredentialsDto } from './dto/credentials.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenDto } from './dto/access-token.dto';
import { UserResponseDto } from './dto/user-response.dto';
import {
  BadRequestResponseDto,
  InternalServerErrorResponseDto,
  UnauthorizedResponseDto,
} from '../common/dto/response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({ summary: 'ユーザ登録' })
  @ApiCreatedResponse({
    description: 'ユーザ登録完了',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: '入力値のフォーマットエラー',
    type: BadRequestResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'DBサーバ接続エラー',
    type: InternalServerErrorResponseDto,
  })
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return await this.authService.signUp(createUserDto);
  }

  @ApiOperation({ summary: 'ユーザ認証' })
  @ApiOkResponse({
    description: 'ユーザ認証完了',
    type: AccessTokenDto,
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
  @Post('signin')
  async singIn(
    @Body() credentialsDto: CredentialsDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.signIn(credentialsDto);
  }
}
