import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from './createTestApp';

describe('MailListEntriesController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

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
  });

  it('/mail-lists/:id/entries (POST) should work', async () => {
    const mailList = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    const mailListEntry = await request(app.getHttpServer())
      .post(`/mail-lists/${mailList.body._id}/entries`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: `test2${
          Date.now() * Math.floor(Math.random() * 100000)
        }@test.de`,
      })
      .expect(201);

    expect(mailListEntry.body._id).toBeDefined();
    expect(mailListEntry.body.isVerified).toStrictEqual(false);
    expect(mailListEntry.body.isUnsubscribed).toStrictEqual(false);

    expect(mailListEntry.body.verifiedAt).not.toBeDefined();
    expect(mailListEntry.body.unsubscribedAt).not.toBeDefined();
    expect(mailListEntry.body.verificationToken).not.toBeDefined();
    expect(mailListEntry.body.unsubscribeToken).not.toBeDefined();
  });

  it('/mail-lists/:id/entries (POST) should not be accessible without auth', async () => {
    request(app.getHttpServer())
      .post('/mail-lists/6582f7916c67fab161df17d7/entries')
      .set('Authorization', `Bearer dawdfergfeadw`)
      .send({
        name: 'Test',
      })
      .expect(401);
  });

  it('/mail-lists/:id/entries (POST) should send 400, when request data is malformed', async () => {
    const mailList = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    request(app.getHttpServer())
      .post(`/mail-lists/${mailList.body._id}/entries`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'testtest.de',
      })
      .expect(400);

    request(app.getHttpServer())
      .post(`/mail-lists/${mailList.body._id}/entries`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({})
      .expect(400);
  });

  it('/mail-lists/:id/entries (POST) should send 400, when MailList does not exist', async () => {
    request(app.getHttpServer())
      .post(`/mail-lists/6582f7916c67fab161df17d7/entries`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: `test2${
          Date.now() * Math.floor(Math.random() * 100000)
        }@test.de`,
      })
      .expect(400);
  });

  it('/mail-lists/:id/entries (POST) should send 403, when MailList is not owned', async () => {
    const signUpRequest = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: `test${Date.now() * Math.floor(Math.random() * 100000)}@test.de`,
        name: 'Mr. Bean',
        password: 'I5_Thi5_PW_Secure?!',
      })
      .expect(201);

    const mailList = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    request(app.getHttpServer())
      .post(`/mail-lists/${mailList.body._id}/entries`)
      .set('Authorization', `Bearer ${signUpRequest.body.accessToken}`)
      .send({
        email: `test2${
          Date.now() * Math.floor(Math.random() * 100000)
        }@test.de`,
      })
      .expect(403);
  });

  it('/mail-lists/:id/entries (POST) should send 409, when MailListEntry with same email in same MailList already exists', async () => {
    const mailList = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    const email = `test2${
      Date.now() * Math.floor(Math.random() * 100000)
    }@test.de`;

    await request(app.getHttpServer())
      .post(`/mail-lists/${mailList.body._id}/entries`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/mail-lists/${mailList.body._id}/entries`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email,
      })
      .expect(409);
  });

  it('/mail-list/:id/entries (GET) should work', async () => {
    const mailList = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    const mailListEntry = await request(app.getHttpServer())
      .post(`/mail-lists/${mailList.body._id}/entries`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: `test2${
          Date.now() * Math.floor(Math.random() * 100000)
        }@test.de`,
      })
      .expect(201);

    request(app.getHttpServer())
      .get(`/mail-lists/${mailList.body._id}/entries`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(200)
      .expect([mailListEntry.body]);
  });

  it('/mail-lists/:id/entries (GET) should not be accessible without auth', async () => {
    request(app.getHttpServer())
      .get(`/mail-lists/6582f7916c67fab161df17d7/entries`)
      .set('Authorization', `Bearer wdawdad`)
      .send()
      .expect(401);
  });

  it('/mail-list/:id/entries (GET) should send 400, when MailList does not exist', async () => {
    request(app.getHttpServer())
      .get(`/mail-lists/6582f7916c67fab161df17d7/entries`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(400);
  });

  it('/mail-lists/:id/entries (GET) should send 403, when MailList is not owned', async () => {
    const signUpRequest = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: `test${Date.now() * Math.floor(Math.random() * 100000)}@test.de`,
        name: 'Mr. Bean',
        password: 'I5_Thi5_PW_Secure?!',
      })
      .expect(201);

    const mailList = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    request(app.getHttpServer())
      .get(`/mail-lists/${mailList.body._id}/entries`)
      .set('Authorization', `Bearer ${signUpRequest.body.accessToken}`)
      .expect(403);
  });

  it('/mail-lists/:id/entries/:id (DELETE) should work', async () => {
    const mailList = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    const mailListEntry = await request(app.getHttpServer())
      .post(`/mail-lists/${mailList.body._id}/entries`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: `test2${
          Date.now() * Math.floor(Math.random() * 100000)
        }@test.de`,
      })
      .expect(201);
    console.log(
      `/mail-lists/${mailList.body._id}/entries/${mailListEntry.body._id}`,
    );
    await request(app.getHttpServer())
      .delete(
        `/mail-lists/${mailList.body._id}/entries/${mailListEntry.body._id}`,
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(200);

    request(app.getHttpServer())
      .get(`/mail-lists/${mailList.body._id}/entries`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(200)
      .expect([]);
  });

  it('/mail-lists/:id/entries/:id (DELETE) should not be accessible without auth', async () => {
    request(app.getHttpServer())
      .delete(
        `/mail-lists/6582f7916c67fab161df17d7/entries/6582f7916c67fab161df17d7`,
      )
      .set('Authorization', `Bearer asdad`)
      .send()
      .expect(401)
      .expect([]);
  });

  it('/mail-lists/:id/entries/:id (DELETE) should send 400, when MailList does not exist', async () => {
    request(app.getHttpServer())
      .delete(
        `/mail-lists/6582f7916c67fab161df17d7/entries/6582f7916c67fab161df17d7`,
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(400)
      .expect([]);
  });

  it('/mail-lists/:id/entries/:id (DELETE) should send 404, when MailListEntry does not exist', async () => {
    const mailList = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    request(app.getHttpServer())
      .delete(
        `/mail-lists/${mailList.body._id}/entries/6582f7916c67fab161df17d7`,
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
      .expect(404);
  });

  it('/mail-lists/:id/entries/:id (DELETE) should send 403, when MailList is not owned', async () => {
    const signUpRequest = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: `test${Date.now() * Math.floor(Math.random() * 100000)}@test.de`,
        name: 'Mr. Bean',
        password: 'I5_Thi5_PW_Secure?!',
      })
      .expect(201);

    const mailList = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    request(app.getHttpServer())
      .delete(`/mail-lists/${mailList.body._id}/entries`)
      .set('Authorization', `Bearer ${signUpRequest.body.accessToken}`)
      .expect(403);
  });
});
