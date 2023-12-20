import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { StatusMessages } from '../src/constants';
import { createTestApp } from './createTestApp';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestApp();
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: StatusMessages.OK });
  });
});
