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

  it('/mail-lists (POST) should work', async () => {
    const test = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    expect(test.body.name).toStrictEqual('Test');
    expect(test.body.ownerId).toStrictEqual(userId);
    expect(test.body._id).toBeDefined();
  });

  it('/mail-lists (POST) should not be accessible without valid auth', async () => {
    request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', 'Bearer wadjo30489w3peiof')
      .send({
        name: 'Test',
      })
      .expect(401);
  });

  it('/mail-lists (POST) should send 400, when data is malformed', async () => {
    request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: '',
      })
      .expect(400);

    request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({})
      .expect(400);
  });

  it('/mail-lists (GET) should work', async () => {
    const createMailListRequest = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    const test = await request(app.getHttpServer())
      .get(`/mail-lists`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect([createMailListRequest.body]);
  });

  it('/mail-lists/:id (GET) should not be accessible, without valid auth', async () => {
    await request(app.getHttpServer())
      .get(`/mail-lists`)
      .set('Authorization', `Bearer 3efeawdaw`)
      .expect(401);
  });

  it('/mail-lists/:id (DELETE) should work', async () => {
    const createMailListRequest = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/mail-lists/${createMailListRequest.body._id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/mail-lists/${createMailListRequest.body._id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

  it('/mail-lists/:id (DELETE) send 409, when campaign exist, that uses mailList', async () => {
    const createMailListRequest = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: createMailListRequest.body._id,
        name: 'Test',
        monthlyMailFrequency: 30,
      })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/mail-lists/${createMailListRequest.body._id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(409);
  });

  it('/mail-lists/:id (DELETE) should not be accessible, without valid auth', async () => {
    await request(app.getHttpServer())
      .delete(`/mail-lists/6582f7916c67fab161df17d7`)
      .set('Authorization', `Bearer 3efeawdaw`)
      .expect(401);
  });

  it('/mail-lists/:id (DELETE) should send 403, when trying to delete a MailList that is not owned', async () => {
    const signUpRequest = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: `test${Date.now() * Math.floor(Math.random() * 100000)}@test.de`,
        name: 'Mr. Bean',
        password: 'I5_Thi5_PW_Secure?!',
      })
      .expect(201);

    const createMailListRequest = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/mail-lists/${createMailListRequest.body._id}`)
      .set('Authorization', `Bearer ${signUpRequest.body.accessToken}`)
      .expect(403);
  });

  it('/mail-lists/:id (PUT) should work', async () => {
    const createMailListRequest = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    const test = await request(app.getHttpServer())
      .put(`/mail-lists/${createMailListRequest.body._id}`)
      .send({
        name: 'Test 2',
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(test.body.name).toStrictEqual('Test 2');
    expect(test.body.ownerId).toStrictEqual(userId);
    expect(test.body._id).toStrictEqual(createMailListRequest.body._id);
  });

  it('/mail-lists/:id (PUT) should not be accessible, without valid auth', async () => {
    await request(app.getHttpServer())
      .put(`/mail-lists/6582f7916c67fab161df17d7`)
      .set('Authorization', `Bearer 3efeawdaw`)
      .expect(401);
  });

  it('/mail-lists/:id (PUT) should send 403, when trying to update a MailList that is not owned', async () => {
    const signUpRequest = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: `test${Date.now() * Math.floor(Math.random() * 100000)}@test.de`,
        name: 'Mr. Bean',
        password: 'I5_Thi5_PW_Secure?!',
      })
      .expect(201);

    const createMailListRequest = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    await request(app.getHttpServer())
      .put(`/mail-lists/${createMailListRequest.body._id}`)
      .set('Authorization', `Bearer ${signUpRequest.body.accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(403);
  });

  it('/mail-lists/:id (PUT) should send 400, when data is malformed', async () => {
    const createMailListRequest = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    request(app.getHttpServer())
      .put(`/mail-lists/${createMailListRequest.body._id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({})
      .expect(400);

    request(app.getHttpServer())
      .put(`/mail-lists/${createMailListRequest.body._id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({})
      .expect(400);
  });
});
