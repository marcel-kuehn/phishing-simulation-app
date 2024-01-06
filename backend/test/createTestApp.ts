import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { ErrorTypes } from '../src/constants';
import {
  MongoDuplicationErrorFilter,
  MongoValidationErrorFilter,
} from '../src/database/database.filters';

export const createTestApp = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
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

  return app;
};
