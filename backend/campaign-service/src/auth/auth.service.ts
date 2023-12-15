import { Injectable, UnauthorizedException } from '@nestjs/common';
import mongoose from 'mongoose';
import { ErrorTypes } from 'src/errors/errors.constants';

@Injectable()
export class AuthService {
  getUserId = (bearer: string): mongoose.Types.ObjectId => {
    // TODO -> implement auth
    if (bearer) return new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');

    throw new UnauthorizedException(ErrorTypes.AUTH_HEADER_INVALID);
  };
}
