import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from './createTestApp';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestApp();
    await app.init();
  });

  it('/auth/signup (POST) should work', async () => {
    const test = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: `test${Date.now()}@test.de`,
        name: 'Mr. Bean',
        password: 'I5_Thi5_PW_Secure?!',
      })
      .expect(201);

    expect(test.body.userId).toBeDefined();
    expect(test.body.accessToken).toBeDefined();
    expect(test.body.refreshToken).toBeDefined();
  });

  it('/auth/signup (POST) should send 400, when credentials are missing or invalid', () => {
    request(app.getHttpServer()).post('/auth/signup').expect(400);

    request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: `test${Date.now()}@test.de`,
        name: '',
        password: 'I5_Thi5_PW_Secure?!',
      })
      .expect(400);

    request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: `test${Date.now()}@test.de`,
        name: 'Mr. Bean',
        password: '123456',
      })
      .expect(400);

    request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: `awd`, name: 'Mr. Bean', password: 'I5_Thi5_PW_Secure?!' })
      .expect(400);
  });

  it('/auth/signup (POST) should send 409, when user exists', async () => {
    const email = `test${Date.now()}@test.de`;
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, name: 'Mr. Bean', password: 'I5_Thi5_PW_Secure?!' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, name: 'Mr. Bean', password: 'I5_Thi5_PW_Secure?!' })
      .expect(409);
  });

  it('/auth/signin (POST) should work', async () => {
    const email = `test${Date.now()}@test.de`;
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, name: 'Mr. Bean', password: 'I5_Thi5_PW_Secure?!' })
      .expect(201);

    const test = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password: 'I5_Thi5_PW_Secure?!' })
      .expect(201);

    expect(test.body.userId).toBeDefined();
    expect(test.body.accessToken).toBeDefined();
    expect(test.body.refreshToken).toBeDefined();
  });
});
