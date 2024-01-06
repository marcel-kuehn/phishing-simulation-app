import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import mongoose from 'mongoose';
import { SignInDto, SignUpDto } from './auth.dto';
import { jwtConstants } from '../constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async generateAccessToken(userId: mongoose.Types.ObjectId): Promise<string> {
    return this.jwtService.signAsync(
      { userId: userId.toString() },
      { secret: jwtConstants.secret },
    );
  }

  async generateRefreshToken(userId: mongoose.Types.ObjectId): Promise<string> {
    return this.jwtService.signAsync({ userId: userId.toString() });
  }

  async signIn(signInDto: SignInDto): Promise<{
    userId: mongoose.Types.ObjectId;
    accessToken: string;
    refreshToken: string;
  }> {
    const userId = await this.usersService.verifyUserCredentials(signInDto);

    return {
      userId,
      accessToken: await this.generateAccessToken(userId),
      refreshToken: await this.generateRefreshToken(userId),
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<{
    userId: mongoose.Types.ObjectId;
    accessToken: string;
    refreshToken: string;
  } | null> {
    const userId = await this.usersService.create(signUpDto);

    return {
      userId,
      accessToken: await this.generateAccessToken(userId),
      refreshToken: await this.generateRefreshToken(userId),
    };
  }

  async getNewTokensIfRefreshTokenMatches(
    userId: mongoose.Types.ObjectId,
    refreshToken: string,
  ): Promise<{
    userId: mongoose.Types.ObjectId;
    accessToken: string;
    refreshToken: string;
  } | null> {
    return {
      userId,
      accessToken: await this.generateAccessToken(userId),
      refreshToken: await this.generateRefreshToken(userId),
    };
  }
}
