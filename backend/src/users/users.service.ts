import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { User } from './user.schema';
import mongoose from 'mongoose';
import { SignInDto, SignUpDto } from '../auth/auth.dto';
import { ErrorTypes } from '../constants';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL')
    private readonly userModel: mongoose.Model<User>,
  ) {}

  async findOne(id: mongoose.Types.ObjectId): Promise<User | null> {
    return this.userModel.findOne({ _id: id }).lean().exec();
  }

  async verifyUserCredentials(
    signInDto: SignInDto,
  ): Promise<mongoose.Types.ObjectId> {
    const user = await this.userModel
      .findOne({ email: signInDto.email, password: signInDto.password })
      .lean()
      .exec();
    if (!user) throw new ForbiddenException(ErrorTypes.INVALID_CREDENTIALS);

    return user._id;
  }

  async create(signUpDto: SignUpDto): Promise<mongoose.Types.ObjectId> {
    const user = await this.userModel.create(signUpDto);
    return user._id;
  }
}
