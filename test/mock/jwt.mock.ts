import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as BaseJwtStrategy } from 'passport-jwt';

export const mockJwtService = () => ({
  sign: jest.fn(() => 'mocked-jwt-token'),
  verify: jest.fn(() => ({ username: 'mocked-user' })),
});

@Injectable()
export class MockJwtStrategy extends PassportStrategy(BaseJwtStrategy) {
  constructor() {
    super({
      secretOrKey: process.env.JWT_SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  validate(payload: unknown): unknown {
    return payload;
  }
}
