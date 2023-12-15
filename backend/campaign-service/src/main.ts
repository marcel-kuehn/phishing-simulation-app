import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ErrorTypes } from './errors/errors.constants';
import { MongoValidationErrorFilter } from './database/database.filters';
import { ApiAuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new ApiAuthGuard(new AuthService()));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        console.error(errors);
        throw new BadRequestException(ErrorTypes.INVALID_DTO_FORMAT);
      },
    }),
  );
  app.useGlobalFilters(new MongoValidationErrorFilter());
  await app.listen(3000);
}
bootstrap();
