import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ErrorTypes } from './constants';
import {
  MongoDuplicationErrorFilter,
  MongoValidationErrorFilter,
} from './database/database.filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        console.log(errors);
        throw new BadRequestException(ErrorTypes.INVALID_DTO_FORMAT);
      },
    }),
  );
  app.useGlobalFilters(new MongoValidationErrorFilter());
  app.useGlobalFilters(new MongoDuplicationErrorFilter());
  await app.listen(3000);
}
bootstrap();
