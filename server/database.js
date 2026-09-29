import mongoose from 'mongoose';

const barrierSchema = new mongoose.Schema({
  id: String,
  title: String,
  evidence: String,
  affected: String,
  severity: { type: String, enum: ['critical', 'high', 'medium', 'low'] },
  confidence: Number,
  region: { x: Number, y: Number, width: Number, height: Number },
}, { _id: false });

const recommendationSchema = new mongoose.Schema({
  id: String,
  title: String,
  action: String,
  costBand: String,
  effort: String,
  scoreGain: Number,
  priority: Number,
  completed: Boolean,
}, { _id: false });

const auditSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  venue: String,
  venueType: String,
  visitorsPerMonth: Number,
  sourceType: String,
  sourceLabel: String,
  imageUrl: String,
  scoreBefore: Number,
  scoreProjected: Number,
  scoreCurrent: Number,
  confidence: Number,
  summary: String,
  summaryHi: String,
  barriers: [barrierSchema],
  recommendations: [recommendationSchema],
  impact: mongoose.Schema.Types.Mixed,
  analysis: mongoose.Schema.Types.Mixed,
  createdAt: String,
  updatedAt: String,
}, { versionKey: false });

const Audit = mongoose.models.Audit || mongoose.model('Audit', auditSchema);

export async function connectDatabase(uri) {
  if (!uri) return null;
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
  return Audit;
}

export { Audit };
