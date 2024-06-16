import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../db/entities/user.entity';
import { CredentialsDto } from './dto/credentials.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenDto } from './dto/access-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  @ApiCreatedResponse({
    description: 'ユーザー登録完了',
  })
  @ApiBadRequestResponse({
    description: '入力値のフォーマットエラー',
  })
  @ApiInternalServerErrorResponse({
    description: 'DBサーバ接続エラー',
  })
  async signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.signUp(createUserDto);
  }

  @Post('signin')
  @ApiOkResponse({
    description: '認証完了',
    type: AccessTokenDto,
  })
  @ApiBadRequestResponse({
    description: '入力値のフォーマットエラー',
  })
  @ApiInternalServerErrorResponse({
    description: 'DBサーバ接続エラー',
  })
  async singIn(
    @Body() credentialsDto: CredentialsDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.signIn(credentialsDto);
  }
}
