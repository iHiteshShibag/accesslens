import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { analyzeWithGemini } from './gemini.js';
import { connectDatabase } from './database.js';
import { createDemoAudit } from '../shared/demoData.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(currentDir, '..');
const samplePath = path.join(rootDir, 'public', 'samples', 'pharmacy-entrance-synthetic.png');

export async function createApp({ seed = true } = {}) {
  const app = express();
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_request, file, callback) => callback(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)),
  });
  let model = null;
  const audits = new Map();
  const events = [];

  if (seed) {
    const seeded = createDemoAudit({ id: 'audit-seed', createdAt: '2026-09-28T10:30:00.000Z' });
    audits.set(seeded.id, seeded);
  }

  try {
    model = await connectDatabase(process.env.MONGODB_URI);
  } catch (error) {
    console.warn(`MongoDB unavailable; using in-memory demo store: ${error.message}`);
  }

  const saveAudit = async (audit) => {
    audits.set(audit.id, audit);
    if (model) await model.findOneAndUpdate({ id: audit.id }, audit, { upsert: true });
    return audit;
  };

  const getAudit = async (id) => audits.get(id) || (model ? model.findOne({ id }).lean() : null);

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_request, response) => response.json({ ok: true, gemini: Boolean(process.env.GEMINI_API_KEY), database: model ? 'mongodb' : 'memory' }));

  app.get('/api/audits', async (_request, response) => {
    const stored = model ? await model.find().sort({ createdAt: -1 }).lean() : [...audits.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    response.json(stored);
  });

  app.get('/api/metrics', (_request, response) => {
    const list = [...audits.values()];
    response.json({
      audits: list.length,
      barriersFound: list.reduce((total, audit) => total + audit.barriers.length, 0),
      fixesCompleted: list.reduce((total, audit) => total + audit.recommendations.filter((item) => item.completed).length, 0),
      estimatedPeopleHelpedMonthly: list.reduce((total, audit) => total + audit.impact.estimatedPeopleHelpedMonthly, 0),
      analyticsEvents: events.length,
    });
  });

  app.post('/api/events', (request, response) => {
    events.push({ ...request.body, at: new Date().toISOString() });
    response.status(202).json({ accepted: true });
  });

  app.post('/api/audits/analyze', upload.single('image'), async (request, response, next) => {
    try {
      const isSample = request.body.sampleId === 'pharmacy-entrance';
      const imageBuffer = request.file?.buffer || (isSample ? await fs.readFile(samplePath) : null);
      const mimeType = request.file?.mimetype || 'image/png';
      if (!imageBuffer) return response.status(400).json({ error: 'Choose a JPG, PNG, or WebP image before analysis.' });

      const venue = String(request.body.venue || '').trim();
      const venueType = String(request.body.venueType || '').trim();
      const visitorsPerMonth = Math.max(0, Number(request.body.visitorsPerMonth || 0));
      if (!venue || !venueType) return response.status(400).json({ error: 'Venue name and type are required.' });

      const audit = await analyzeWithGemini({ imageBuffer, mimeType, venue, venueType, visitorsPerMonth });
      audit.id = `audit-${Date.now()}`;
      audit.imageUrl = isSample ? '/samples/pharmacy-entrance-synthetic.png' : `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
      audit.sourceType = isSample ? 'synthetic_demo' : 'user_upload';
      audit.sourceLabel = isSample ? 'Synthetic demo image — not a real business' : 'User-provided image';
      await saveAudit(audit);
      events.push({ name: 'analysis_completed', auditId: audit.id, mode: audit.analysis.mode, at: new Date().toISOString() });
      return response.status(201).json(audit);
    } catch (error) {
      return next(error);
    }
  });

  app.patch('/api/audits/:auditId/recommendations/:recommendationId', async (request, response) => {
    const audit = await getAudit(request.params.auditId);
    if (!audit) return response.status(404).json({ error: 'Audit not found.' });
    const recommendation = audit.recommendations.find((item) => item.id === request.params.recommendationId);
    if (!recommendation) return response.status(404).json({ error: 'Recommendation not found.' });
    recommendation.completed = Boolean(request.body.completed);
    audit.scoreCurrent = Math.min(audit.scoreProjected, audit.scoreBefore + audit.recommendations.filter((item) => item.completed).reduce((sum, item) => sum + item.scoreGain, 0));
    audit.updatedAt = new Date().toISOString();
    await saveAudit(audit);
    events.push({ name: 'recommendation_toggled', auditId: audit.id, recommendationId: recommendation.id, completed: recommendation.completed, at: audit.updatedAt });
    return response.json(audit);
  });

  app.use(express.static(path.join(rootDir, 'dist')));
  app.get('/{*splat}', async (request, response, next) => {
    if (request.path.startsWith('/api')) return next();
    try {
      await fs.access(path.join(rootDir, 'dist', 'index.html'));
      return response.sendFile(path.join(rootDir, 'dist', 'index.html'));
    } catch {
      return response.status(404).send('Build the client with npm run build.');
    }
  });

  app.use((error, _request, response, _next) => {
    console.error(error);
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') return response.status(413).json({ error: 'Image must be smaller than 10 MB.' });
    return response.status(500).json({ error: 'Analysis failed. Retry or use the built-in offline demo.' });
  });

  return app;
}
