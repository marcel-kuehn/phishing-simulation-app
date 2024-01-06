import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from './createTestApp';

describe('CampaignsController (e2e)', () => {
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

  it('/campaigns (POST) should work', async () => {
    const mailListData = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    const test = await request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: mailListData.body._id,
        name: 'Test',
        monthlyMailFrequency: 30,
      })
      .expect(201);

    expect(test.body.name).toStrictEqual('Test');
    expect(test.body.mailListId).toStrictEqual(mailListData.body._id);
    expect(test.body.monthlyMailFrequency).toStrictEqual(30);
    expect(test.body.ownerId).toStrictEqual(userId);
    expect(test.body._id).toBeDefined();
  });

  it('/campaigns (POST) should not be accessible without valid auth', async () => {
    request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', 'Bearer wadjo30489w3peiof')
      .send({
        mailListId: '6582f7916c67fab161df17d7',
        name: 'Test',
        monthlyMailFrequency: 30,
      })
      .expect(401);
  });

  it('/campaigns (POST) should send 400, when mailList does not exist', async () => {
    await request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: '6582f7916c67fab161df17d7',
        name: 'Test',
        monthlyMailFrequency: 30,
      })
      .expect(400);
  });

  it('/campaigns (POST) should send 403, when mailList is not owned', async () => {
    const signUpRequest = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: `test${Date.now() * Math.floor(Math.random() * 100000)}@test.de`,
        name: 'Mr. Bean',
        password: 'I5_Thi5_PW_Secure?!',
      })
      .expect(201);

    const mailListNotOwnedData = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${signUpRequest.body.accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: mailListNotOwnedData.body._id,
        name: 'Test',
        monthlyMailFrequency: 30,
      })
      .expect(403);
  });

  it('/campaigns (POST) should send 400, when data is malformed', async () => {
    const mailListData = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: mailListData.body._id,
        name: 'Test',
        monthlyMailFrequency: -1,
      })
      .expect(400);

    request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({})
      .expect(400);

    request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: 'awd',
        name: 'Test',
        monthlyMailFrequency: 30,
      })
      .expect(400);

    request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: mailListData.body._id,
        name: '',
        monthlyMailFrequency: 30,
      })
      .expect(400);
  });

  it('/campaigns (GET) should work', async () => {
    const mailListData = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    const createCampaignRequest = await request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: mailListData.body._id,
        name: 'Test',
        monthlyMailFrequency: 30,
      })
      .expect(201);

    await request(app.getHttpServer())
      .get(`/campaigns`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect([createCampaignRequest.body]);
  });

  it('/campaigns/:id (GET) should not be accessible, without valid auth', async () => {
    await request(app.getHttpServer())
      .get(`/campaigns`)
      .set('Authorization', `Bearer 3efeawdaw`)
      .expect(401);
  });

  it('/campaigns/:id (DELETE) should work', async () => {
    const mailListData = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    const createCampaignRequest = await request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: mailListData.body._id,
        name: 'Test',
        monthlyMailFrequency: 30,
      })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/campaigns/${createCampaignRequest.body._id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/campaigns/${createCampaignRequest.body._id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

  it('/campaigns/:id (DELETE) should not be accessible, without valid auth', async () => {
    await request(app.getHttpServer())
      .delete(`/campaigns/6582f7916c67fab161df17d7`)
      .set('Authorization', `Bearer 3efeawdaw`)
      .expect(401);
  });

  it('/campaigns/:id (DELETE) should send 403, when trying to delete a campaign that is not owned', async () => {
    const signUpRequest = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: `test${Date.now() * Math.floor(Math.random() * 100000)}@test.de`,
        name: 'Mr. Bean',
        password: 'I5_Thi5_PW_Secure?!',
      })
      .expect(201);

    const mailListData = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    const createCampaignRequest = await request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: mailListData.body._id,
        name: 'Test',
        monthlyMailFrequency: 30,
      })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/campaigns/${createCampaignRequest.body._id}`)
      .set('Authorization', `Bearer ${signUpRequest.body.accessToken}`)
      .expect(403);
  });

  it('/campaigns/:id (PUT) should work', async () => {
    const mailListData = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    const createCampaignRequest = await request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: mailListData.body._id,
        name: 'Test',
        monthlyMailFrequency: 30,
      })
      .expect(201);

    const mailListData2 = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    const test = await request(app.getHttpServer())
      .put(`/campaigns/${createCampaignRequest.body._id}`)
      .send({
        mailListId: mailListData2.body._id,
        name: 'Test 2',
        monthlyMailFrequency: 15,
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(test.body.name).toStrictEqual('Test 2');
    expect(test.body.mailListId).toStrictEqual(mailListData2.body._id);
    expect(test.body.monthlyMailFrequency).toStrictEqual(15);
    expect(test.body.ownerId).toStrictEqual(userId);
    expect(test.body._id).toStrictEqual(createCampaignRequest.body._id);
  });

  it('/campaigns/:id (PUT) should not be accessible, without valid auth', async () => {
    await request(app.getHttpServer())
      .put(`/campaigns/6582f7916c67fab161df17d7`)
      .set('Authorization', `Bearer 3efeawdaw`)
      .expect(401);
  });

  it('/campaigns/:id (PUT) should send 403, when trying to update a campaign that is not owned', async () => {
    const signUpRequest = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: `test${Date.now() * Math.floor(Math.random() * 100000)}@test.de`,
        name: 'Mr. Bean',
        password: 'I5_Thi5_PW_Secure?!',
      })
      .expect(201);

    const mailListData = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    const createCampaignRequest = await request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: mailListData.body._id,
        name: 'Test',
        monthlyMailFrequency: 30,
      })
      .expect(201);

    await request(app.getHttpServer())
      .put(`/campaigns/${createCampaignRequest.body._id}`)
      .set('Authorization', `Bearer ${signUpRequest.body.accessToken}`)
      .send({
        mailListId: '6582f7916c67fab161df17d7',
        name: 'Test',
        monthlyMailFrequency: 30,
      })
      .expect(403);
  });

  it('/campaigns/:id (PUT) should send 403, when updating campaign with mailList that is not owned', async () => {
    const signUpRequest = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: `test${Date.now() * Math.floor(Math.random() * 100000)}@test.de`,
        name: 'Mr. Bean',
        password: 'I5_Thi5_PW_Secure?!',
      })
      .expect(201);

    const mailListOwnedData = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    const mailListNotOwnedData = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${signUpRequest.body.accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    const createCampaignRequest = await request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: mailListOwnedData.body._id,
        name: 'Test',
        monthlyMailFrequency: 30,
      })
      .expect(201);

    await request(app.getHttpServer())
      .put(`/campaigns/${createCampaignRequest.body._id}`)
      .send({
        mailListId: mailListNotOwnedData.body._id,
        name: 'Test 2',
        monthlyMailFrequency: 15,
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(403);
  });

  it('/campaigns/:id (PUT) should send 400, when mailList does not exist', async () => {
    const mailListData = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    const createCampaignRequest = await request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: mailListData.body._id,
        name: 'Test',
        monthlyMailFrequency: 30,
      })
      .expect(201);

    await request(app.getHttpServer())
      .put(`/campaigns/${createCampaignRequest.body._id}`)
      .send({
        mailListId: '6582f7916c67fab161df17d8',
        name: 'Test 2',
        monthlyMailFrequency: 15,
      })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(400);
  });

  it('/campaigns/:id (PUT) should send 400, when data is malformed', async () => {
    const mailListData = await request(app.getHttpServer())
      .post('/mail-lists')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
      })
      .expect(201);

    const createCampaignRequest = await request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: mailListData.body._id,
        name: 'Test',
        monthlyMailFrequency: 30,
      })
      .expect(201);

    request(app.getHttpServer())
      .put(`/campaigns/${createCampaignRequest.body._id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: mailListData.body._id,
        name: 'Test',
        monthlyMailFrequency: -1,
      })
      .expect(400);

    request(app.getHttpServer())
      .put(`/campaigns/${createCampaignRequest.body._id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({})
      .expect(400);

    request(app.getHttpServer())
      .put(`/campaigns/${createCampaignRequest.body._id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: 'awd',
        name: 'Test',
        monthlyMailFrequency: 30,
      })
      .expect(400);

    request(app.getHttpServer())
      .put(`/campaigns/${createCampaignRequest.body._id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: mailListData.body._id,
        name: '',
        monthlyMailFrequency: 30,
      })
      .expect(400);
  });
});
