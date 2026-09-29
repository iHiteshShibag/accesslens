import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../server/app.js';

describe('AccessLens API', () => {
  beforeEach(() => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.MONGODB_URI;
  });

  it('reports demo-mode health without secrets', async () => {
    const app = await createApp({ seed: false });
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ok: true, database: 'memory' });
  });

  it('analyzes the synthetic sample end to end', async () => {
    const app = await createApp({ seed: false });
    const response = await request(app)
      .post('/api/audits/analyze')
      .field('sampleId', 'pharmacy-entrance')
      .field('venue', 'Harbor Health Pharmacy')
      .field('venueType', 'Pharmacy')
      .field('visitorsPerMonth', '1200');
    expect(response.status).toBe(201);
    expect(response.body.analysis.mode).toBe('demo_fixture');
    expect(response.body.barriers).toHaveLength(4);
    expect(response.body.scoreBefore).toBe(42);
  });

  it('tracks completed actions and recalculates the score', async () => {
    const app = await createApp({ seed: false });
    const created = await request(app)
      .post('/api/audits/analyze')
      .field('sampleId', 'pharmacy-entrance')
      .field('venue', 'Harbor Health Pharmacy')
      .field('venueType', 'Pharmacy');
    const response = await request(app)
      .patch(`/api/audits/${created.body.id}/recommendations/rec-clear`)
      .send({ completed: true });
    expect(response.status).toBe(200);
    expect(response.body.scoreCurrent).toBe(50);
    expect(response.body.recommendations[0].completed).toBe(true);
  });
});
