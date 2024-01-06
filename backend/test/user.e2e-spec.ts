import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from './createTestApp';

describe('MailListsController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: string;

  beforeEach(async () => {
    app = await createTestApp();
    await app.init();

    const test = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: `test${Date.now() * Math.floor(Math.random() * 100000)}@test.de`,
        name: 'Mr. Bean',
        password: 'I5_Thi5_PW_Secure?!',
      })
      .expect(201);

    accessToken = test.body.accessToken;
    userId = test.body.userId;
  });

  it('/users/me (GET) should work', async () => {
    const test = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(test.body.name).toStrictEqual('Mr. Bean');
    expect(test.body.email).not.toBeDefined();
    expect(test.body.password).not.toBeDefined();
    expect(test.body._id).toBeDefined();
  });

  it('/users/me (GET) should not be accessible without valid out', async () => {
    const test = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer eawdawdwa`)
      .send()
      .expect(401);
  });
});