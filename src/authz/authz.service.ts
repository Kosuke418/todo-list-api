import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CredentialsDto } from './dto/credentials.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { AccessTokenDto } from './dto/access-token.dto';

@Injectable()
export class AuthzService {
  constructor(private httpService: HttpService) {}

  async registerUser(credentialsDto: CredentialsDto): Promise<UserResponseDto> {
    const { email, password } = credentialsDto;
    const url = `${process.env.AUTH0_ISSUER_URL}dbconnections/signup`;
    const data = {
      client_id: process.env.AUTH0_AUDIENCE,
      email,
      password,
      connection: 'Username-Password-Authentication',
    };
    let res;
    try {
      res = await lastValueFrom(this.httpService.post(url, data));
    } catch (e) {
      throw new InternalServerErrorException();
    }

    return { email: res.data.email };
  }

  async getToken(credentialsDto: CredentialsDto): Promise<AccessTokenDto> {
    const { email, password } = credentialsDto;
    const url = `${process.env.AUTH0_ISSUER_URL}oauth/token`;
    const data = {
      client_id: process.env.AUTH0_AUDIENCE,
      client_secret: process.env.AUTH0_SECRET,
      grant_type: 'password',
      username: email,
      password,
    };
    let res;
    try {
      res = await lastValueFrom(this.httpService.post(url, data));
    } catch (e) {
      throw new InternalServerErrorException();
    }

    return { accessToken: res.data.id_token };
  }
}
