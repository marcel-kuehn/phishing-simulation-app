import {
  Controller,
  Get,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ErrorTypes } from '../constants';
import mongoose from 'mongoose';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AuthUserId } from '../auth/auth.decorators';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async find(
    @AuthUserId() authUserId: mongoose.Types.ObjectId,
  ): Promise<{ _id: mongoose.Types.ObjectId; name: string }> {
    const user = await this.usersService.findOne(authUserId);
    if (!user) throw new NotFoundException(ErrorTypes.DOCUMENT_NOT_FOUND);

    return { _id: user._id, name: user.name };
  }
}
