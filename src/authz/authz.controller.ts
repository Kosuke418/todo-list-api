import { Body, Controller, Post } from '@nestjs/common';
import { AuthzService } from './authz.service';
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

@ApiTags('authz')
@Controller('authz')
export class AuthzController {
  constructor(private readonly authzService: AuthzService) {}
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
  async signUp(
    @Body() credentialsDto: CredentialsDto,
  ): Promise<UserResponseDto> {
    return await this.authzService.registerUser(credentialsDto);
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
  ): Promise<AccessTokenDto> {
    return await this.authzService.getToken(credentialsDto);
  }
}
