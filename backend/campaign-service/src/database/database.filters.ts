import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import mongoose from 'mongoose';
import { ErrorTypes } from 'src/constants';

@Catch(mongoose.Error.ValidationError)
export class MongoValidationErrorFilter implements RpcExceptionFilter {
  catch(exception: mongoose.Error.ValidationError, host: ArgumentsHost): any {
    console.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    return response.status(400).json({
      message: ErrorTypes.SCHEMA_VALIDATION_ERROR,
      error: 'Bad Request',
      statusCode: 400,
    });
  }
}

@Catch(mongoose.mongo.MongoError)
export class MongoDuplicationErrorFilter implements RpcExceptionFilter {
  catch(exception: mongoose.mongo.MongoError, host: ArgumentsHost): any {
    console.error(exception);

    if (exception.name !== 'MongoServerError' && exception.code !== '11000') {
      throw exception;
    }

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    return response.status(409).json({
      message: ErrorTypes.DUPLICATED_KEY_INDEX_ERROR,
      error: 'Conflict',
      statusCode: 409,
    });
  }
}
