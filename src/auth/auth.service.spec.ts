import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { User } from '../db/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CredentialsDto } from './dto/credentials.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(
      getRepositoryToken(User),
    ) as jest.Mocked<Repository<User>>;
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signUp', () => {
    it('正常系', async () => {
      const credentialsDto: CredentialsDto = {
        username: 'testuser',
        password: 'testpass',
      };
      const user: User = {
        id: '3a0ac1d7-0328-9dbd-b2d5-16724a5385b5',
        username: 'testuser',
        password: await bcrypt.hash('testpass', 10),
        tasks: [],
        createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
        updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
      };

      jest.spyOn(userRepository, 'create').mockImplementation(async () => user);
      jest.spyOn(userRepository, 'save').mockImplementation(async () => user);

      const result = await authService.signUp(credentialsDto);

      expect(result).toEqual({ username: 'testuser' });
    });
  });

  describe('signIn', () => {
    it('正常系', async () => {
      const credentialsDto: CredentialsDto = {
        username: 'testuser',
        password: 'testpass',
      };

      const user: User = {
        id: '3a0ac1d7-0328-9dbd-b2d5-16724a5385b5',
        username: 'testuser',
        password: await bcrypt.hash('testpass', 10),
        tasks: [],
        createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
        updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
      };

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockImplementation(async () => user);
      jest.spyOn(jwtService, 'sign').mockReturnValue('test_token');

      const result = await authService.signIn(credentialsDto);

      expect(result).toEqual({ accessToken: 'test_token' });
    });

    it('異常系：ユーザ名が一致しない', async () => {
      const credentialsDto: CredentialsDto = {
        username: 'testuser',
        password: 'testpass',
      };

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockImplementation(async () => null);

      await expect(authService.signIn(credentialsDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('異常系：パスワードが一致しない', async () => {
      const credentialsDto: CredentialsDto = {
        username: 'testuser',
        password: 'testpass',
      };

      const user: User = {
        id: '3a0ac1d7-0328-9dbd-b2d5-16724a5385b5',
        username: 'testuser',
        password: await bcrypt.hash('wrongpass', 10),
        tasks: [],
        createdAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
        updatedAt: new Date(2022, 5 - 1, 5, 6, 35, 20, 333),
      };

      jest
        .spyOn(userRepository, 'findOneBy')
        .mockImplementation(async () => user);

      await expect(authService.signIn(credentialsDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
