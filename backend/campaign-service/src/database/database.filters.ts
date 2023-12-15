import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { Error } from 'mongoose';
import { ErrorTypes } from 'src/errors/errors.constants';

@Catch(Error.ValidationError)
export class MongoValidationErrorFilter implements RpcExceptionFilter {

  catch(exception: Error.ValidationError, host: ArgumentsHost): any {
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