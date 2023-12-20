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
        email: `test${Date.now()}@test.de`,
        name: 'Mr. Bean',
        password: 'I5_Thi5_PW_Secure?!',
      })
      .expect(201);

    accessToken = test.body.accessToken;
    userId = test.body.userId;
  });

  it('/campaigns (POST) should work', async () => {
    const test = await request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: '6582f7916c67fab161df17d7',
        name: 'Test',
        monthlyMailFrequency: 30,
      })
      .expect(201);

    expect(test.body.name).toStrictEqual('Test');
    expect(test.body.mailListId).toStrictEqual('6582f7916c67fab161df17d7');
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

  it('/campaigns (POST) should data is malformed', async () => {
    request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: '6582f7916c67fab161df17d7',
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
        mailListId: '6582f7916c67fab161df17d7',
        name: '',
        monthlyMailFrequency: 30,
      })
      .expect(400);
  });

  it('/campaigns/:id (GET) should work', async () => {
    const createCampaignRequest = await request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: '6582f7916c67fab161df17d7',
        name: 'Test',
        monthlyMailFrequency: 30,
      })
      .expect(201);

    await request(app.getHttpServer())
      .get(`/campaigns/${createCampaignRequest.body._id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect(createCampaignRequest.body);
  });

  it('/campaigns/:id (GET) should return 404, when campaign was not found', async () => {
    await request(app.getHttpServer())
      .get(`/campaigns/6582f7916c67fab161df17d7`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

  it('/campaigns/:id (GET) should not be accessible without valid auth', async () => {
    await request(app.getHttpServer())
      .get(`/campaigns/6582f7916c67fab161df17d7`)
      .set('Authorization', `Bearer 3efeawdaw`)
      .expect(401);
  });

  it('/campaigns/:id (GET) should send 403, when trying to access a campaign that is not owned', async () => {
    const signUpRequest = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: `test${Date.now()}@test.de`,
        name: 'Mr. Bean',
        password: 'I5_Thi5_PW_Secure?!',
      })
      .expect(201);

    const createCampaignRequest = await request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: '6582f7916c67fab161df17d7',
        name: 'Test',
        monthlyMailFrequency: 30,
      })
      .expect(201);

    await request(app.getHttpServer())
      .get(`/campaigns/${createCampaignRequest.body._id}`)
      .set('Authorization', `Bearer ${signUpRequest.body.accessToken}`)
      .expect(403);
  });

  it('/campaigns (DELETE) should work', async () => {
    const createCampaignRequest = await request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: '6582f7916c67fab161df17d7',
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

  it('/campaigns/:id (DELETE) should not be accessible without valid auth', async () => {
    await request(app.getHttpServer())
      .delete(`/campaigns/6582f7916c67fab161df17d7`)
      .set('Authorization', `Bearer 3efeawdaw`)
      .expect(401);
  });

  it('/campaigns (DELETE) should send 403, when trying to delete a campaign that is not owned', async () => {
    const signUpRequest = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: `test${Date.now()}@test.de`,
        name: 'Mr. Bean',
        password: 'I5_Thi5_PW_Secure?!',
      })
      .expect(201);

    const createCampaignRequest = await request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        mailListId: '6582f7916c67fab161df17d7',
        name: 'Test',
        monthlyMailFrequency: 30,
      })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/campaigns/${createCampaignRequest.body._id}`)
      .set('Authorization', `Bearer ${signUpRequest.body.accessToken}`)
      .expect(403);
  });
});
