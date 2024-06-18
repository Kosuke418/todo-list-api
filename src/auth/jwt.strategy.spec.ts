import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { User } from '../db/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: jest.fn().mockReturnValue('test_secret_key'),
      })
      .compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('validate', () => {
    it('正常系', async () => {
      const user = new User();
      user.id = '3a0ac1d7-0328-9dbd-b2d5-16724a5385b5';
      user.username = 'testuser';

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);

      const result = await jwtStrategy.validate({
        id: 'b3947e05-98e9-bddf-ec5d-da7417e907fa',
        username: 'testuser',
      });
      expect(result).toEqual(user);
    });

    it('異常系：ユーザが一致しない', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      try {
        await jwtStrategy.validate({
          id: '3a0ac1d7-0328-9dbd-b2d5-16724a5385b5',
          username: 'testuser',
        });
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
