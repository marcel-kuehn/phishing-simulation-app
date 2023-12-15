import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import mongoose from 'mongoose';
import { ErrorTypes } from './errors/errors.constants';

@Injectable()
export class ValidateMongoId implements PipeTransform<mongoose.Types.ObjectId> {
  transform(value: mongoose.Types.ObjectId): mongoose.Types.ObjectId {
    try {
      if (mongoose.Types.ObjectId.isValid(value)) {
        return new mongoose.Types.ObjectId(value);
      }
      throw new BadRequestException(ErrorTypes.INVALID_ID_FORMAT);
    } catch {
      throw new BadRequestException(ErrorTypes.INVALID_ID_FORMAT);
    }
  }
}
