import { ExtractJwt, Strategy as BaseJwtStrategy } from 'passport-jwt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '../../db/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// JwtについているPayload情報の型
interface JWTPayload {
  id: User['id'];
  username: User['username'];
}

/**
 * @description JWTの認証処理を行うクラス
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(BaseJwtStrategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super({
      // Authorization bearerからトークンを読み込む関数を返す
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 有効期間を無視するかどうか
      ignoreExpiration: false,
      // envファイルから秘密鍵を渡す
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: JWTPayload): Promise<User> {
    const { id, username } = payload;
    const user = await this.userRepository.findOneBy({ id, username });
    if (user) {
      return user;
    }

    throw new UnauthorizedException();
  }
}
